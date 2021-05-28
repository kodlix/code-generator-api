import { BadRequestException, Injectable } from '@nestjs/common';
import { PageMetaDto } from 'common/dtos';
import { FilterDto } from 'common/dtos/filter.dto';
import { ClientCreditHandlingSettingRepository } from 'modules/client-credit-handling-setting/repositories';
import { UserEntity } from 'modules/user/entities';
import { Brackets, DeleteResult, InsertResult } from 'typeorm';
import { ClientCreditHandlingSettingDto, ClientCreditHandlingSettingPageDto, ClientCreditHandlingSettingPageOptionsDto } from '../dtos';
import { ClientCreditHandlingSettingUpdateDto } from '../dtos/client-credit-handling-setting-update.dto';

@Injectable()
export class ClientCreditHandlingSettingService {
  constructor(private readonly _clientRepository: ClientCreditHandlingSettingRepository) {}

  public async getClientCreditHandlingSettingsASync(accountCode: string,pageOptionsDto: ClientCreditHandlingSettingPageOptionsDto,filterDto: FilterDto): Promise<ClientCreditHandlingSettingPageDto> {
    let queryBuilder = await this._clientRepository.createQueryBuilder('creditHandlingSetting');

    const { q } = filterDto;
    
    if (q) {
      queryBuilder = queryBuilder.where(new Brackets(qb => {
        qb.where("creditHandlingSetting.clientCode ILike :clientCode", { clientCode: `%${q}%` })
        .orWhere("creditHandlingSetting.clientName ILike :clientName", { clientName: `%${q}%` })
        .orWhere("creditHandlingSetting.creditLimit ILike :creditLimit", { creditLimit:  `%${q}%` })
        .orWhere("creditHandlingSetting.allowCredit ILike :allowCredit", { allowCredit: `%${q}%` })
        .orWhere("creditHandlingSetting.maximumCreditDays ILike :maximumCreditDays", { maximumCreditDays: `%${q}%` })
    }))
    }

    const query = queryBuilder
      .where('creditHandlingSetting.disabled = :disabled', { disabled: false })
      .andWhere('creditHandlingSetting.deleted =:deleted', { deleted: false })
      .andWhere('creditHandlingSetting.accountCode =:accountCode', {accountCode})
      .orderBy('creditHandlingSetting.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const [clientsCreditSettings, clientsCreditSettingsCount] = await query.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: clientsCreditSettingsCount,
    });

    const result = new ClientCreditHandlingSettingPageDto(clientsCreditSettings.toDtos(), pageMetaDto);
    return result;
  }

  public async getClientCreditHandlingSettingByIdAsync(id: string): Promise<ClientCreditHandlingSettingDto> {
    const queryBuilder = await this._clientRepository.createQueryBuilder('creditHandlingSetting');

    const query = queryBuilder.where('creditHandlingSetting.id = :id', { id });
    const client = await query.getOne();
    
    if(!client){
      return null;
    }

    return client.toDto();
  }

  public async createClientCreditHandlingSettingAsync(client: ClientCreditHandlingSettingDto, user: UserEntity): Promise<InsertResult> {
    const queryBuilder = await this._clientRepository.createQueryBuilder('creditHandlingSetting');
    
    client.createdBy = user.email;
    const result = await queryBuilder
      .insert()
      .values({ ...client })
      .returning([...Object.keys(client)])
      .execute();

    return result;
  }

  public async updateClientCreditHandlingSettingAsync(id: string, client: ClientCreditHandlingSettingUpdateDto, user: UserEntity): Promise<ClientCreditHandlingSettingDto> {
    const queryBuilder = await this._clientRepository.createQueryBuilder('creditHandlingSetting');

    if (!client) {
      throw new BadRequestException('Client Credit Handling Setting does not exist');
    }

    if (id) {
      throw new BadRequestException('Client Credit Handling Setting does not exist');
    }

    client.updatedBy = user.email;

    await queryBuilder
      .update()
      .set({ ...client })
      .where('id =:id', { id})
      .execute();

    const updatedClientCreditHandlingSetting = await this.getClientCreditHandlingSettingByIdAsync(id);
    return updatedClientCreditHandlingSetting;
  }

  public async deleteClientCreditHandlingSettingAsync(id: string): Promise<DeleteResult> {
    const queryBuilder = await this._clientRepository.createQueryBuilder('creditHandlingSetting' );

    if (!id) {
      throw new BadRequestException('ClientCreditHandlingSetting does not exist');
    }

    const result = await queryBuilder.delete().where('id =:id', { id }).execute();
    return result;
  }

  public async deleteSoftAsync(id: string, user: UserEntity): Promise<DeleteResult> {
    const queryBuilder = await this._clientRepository.createQueryBuilder('creditHandlingSetting' );

    if (!id) {
      throw new BadRequestException('ClientCreditHandlingSetting does not exist');
    }

    const clientToDelete = await this.getClientCreditHandlingSettingByIdAsync(id);
    if(!clientToDelete){
      throw new BadRequestException('ClientCreditHandlingSetting does not exist');
    }
    clientToDelete.deletedBy = user.email;
    clientToDelete.deletedAt = new Date();

    await queryBuilder
      .update()
      .set({deleted: true })
      .where('id =:id', { id })
      .execute();

    const result = await queryBuilder.delete().where('id =:id', { id }).execute();
    return result;
  }
}
