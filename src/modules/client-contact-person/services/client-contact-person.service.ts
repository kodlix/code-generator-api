import { BadRequestException, Injectable } from '@nestjs/common';
import { PageMetaDto } from 'common/dtos';
import { FilterDto } from 'common/dtos/filter.dto';
import { ClientContactPersonRepository } from 'modules/client-contact-person/repositories';
import { UserEntity } from 'modules/user/entities';
import { Brackets, DeleteResult, InsertResult } from 'typeorm';
import { ClientContactPersonDto, ClientContactPersonPageDto, ClientContactPersonPageOptionsDto } from '../dtos';
import { ClientContactPersonUpdateDto } from '../dtos/client-contact-person-update.dto';

@Injectable()
export class ClientContactPersonService {
  constructor(private readonly _clientRepository: ClientContactPersonRepository) {}

  public async getClientContactPersonsASync(accountCode: string,pageOptionsDto: ClientContactPersonPageOptionsDto,filterDto: FilterDto): Promise<ClientContactPersonPageDto> {
    let queryBuilder = await this._clientRepository.createQueryBuilder('clientContactPersion');

    const { q } = filterDto;
    
    if (q) {
      queryBuilder = queryBuilder.where(new Brackets(qb => {
        qb.where("clientContactPersion.clientCode ILike :clientCode", { clientCode: `%${q}%` })
        .orWhere("clientContactPersion.clientName ILike :clientName", { clientName: `%${q}%` })
        .orWhere("clientContactPersion.contactPerson ILike :contactPerson", { address: `%${q}%` })
        .orWhere("clientContactPersion.accountNo ILike :accountNo", { accountNo: `%${q}%` })
        .orWhere("clientContactPersion.commencementDate ILike :commencementDate", { commencementDate: `%${q}%` })
    }))
    }

    const query = queryBuilder
      .where('clientContactPersion.disabled = :disabled', { disabled: false })
      .andWhere('clientContactPersion.deleted =:deleted', { deleted: false })
      .andWhere('clientContactPersion.accountCode =:accountCode', {accountCode})
      .orderBy('clientContactPersion.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const [clients, clientsCount] = await query.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: clientsCount,
    });

    const result = new ClientContactPersonPageDto(clients.toDtos(), pageMetaDto);
    return result;
  }

  public async getClientContactPersonByIdAsync(id: string): Promise<ClientContactPersonDto> {
    const queryBuilder = await this._clientRepository.createQueryBuilder('clientContactPersion');

    const query = queryBuilder.where('clientContactPersion.id = :id', { id });
    const client = await query.getOne();
    
    if(!client){
      return null;
    }

    return client.toDto();
  }

  public async createClientContactPersonAsync(client: ClientContactPersonDto, user: UserEntity): Promise<InsertResult> {
    const queryBuilder = await this._clientRepository.createQueryBuilder('clientContactPersion');
    
    client.createdBy = user.email;
    const result = await queryBuilder
      .insert()
      .values({ ...client })
      .returning([...Object.keys(client)])
      .execute();

    return result;
  }

  public async updateClientContactPersonAsync(id: string, client: ClientContactPersonUpdateDto, user: UserEntity): Promise<ClientContactPersonDto> {
    const queryBuilder = await this._clientRepository.createQueryBuilder('clientContactPersion');

    if (!client) {
      throw new BadRequestException('ClientContactPerson does not exist');
    }

    if (id) {
      throw new BadRequestException('ClientContactPerson does not exist');
    }

    client.updatedBy = user.email;

    await queryBuilder
      .update()
      .set({ ...client })
      .where('clientContactPersion.id =:id', { id})
      .execute();

    const updatedClientContactPerson = await this.getClientContactPersonByIdAsync(id);
    return updatedClientContactPerson;
  }

  public async deleteClientContactPersonAsync(id: string): Promise<DeleteResult> {
    const queryBuilder = await this._clientRepository.createQueryBuilder('clientContactPersion' );

    if (!id) {
      throw new BadRequestException('ClientContactPerson does not exist');
    }

    const result = await queryBuilder.delete().where('clientContactPersion.id =:id', { id }).execute();
    return result;
  }

  public async deleteSoftAsync(id: string, user: UserEntity): Promise<DeleteResult> {
    const queryBuilder = await this._clientRepository.createQueryBuilder('clientContactPersion' );

    if (!id) {
      throw new BadRequestException('ClientContactPerson does not exist');
    }

    const clientToDelete = await this.getClientContactPersonByIdAsync(id);
    if(!clientToDelete){
      throw new BadRequestException('ClientContactPerson does not exist');
    }
    clientToDelete.deletedBy = user.email;
    clientToDelete.deletedAt = new Date();

    const result = await queryBuilder
      .update()
      .set({deleted: true })
      .where('clientContactPersion.id =:id', { id })
      .execute();

    return result;
  }
}
