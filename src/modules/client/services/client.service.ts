import { BadRequestException, Injectable } from '@nestjs/common';
import { PageMetaDto } from 'common/dtos';
import { FilterDto } from 'common/dtos/filter.dto';
import { ClientRepository } from 'modules/client/repositories';
import { UserEntity } from 'modules/user/entities';
import { Brackets, DeleteResult, InsertResult } from 'typeorm';
import { ClientDto, ClientPageDto, ClientPageOptionsDto } from '../dtos';
import { ClientUpdateDto } from '../dtos/client-update.dto';

@Injectable()
export class ClientService {
  constructor(private readonly _clientRepository: ClientRepository) {}

  public async getClientsASync(accountCode: string,pageOptionsDto: ClientPageOptionsDto,filterDto: FilterDto): Promise<ClientPageDto> {
    let queryBuilder = await this._clientRepository.createQueryBuilder('client');

    const { q } = filterDto;
    
    if (q) {
      queryBuilder = queryBuilder.where(new Brackets(qb => {
        qb.where("client.clientCode ILike :clientCode", { clientCode: `%${q}%` })
        .orWhere("client.clientName ILike :clientName", { clientName: `%${q}%` })
        .orWhere("client.address ILike :address", { address: `%${q}%` })
        .orWhere("client.accountNo ILike :accountNo", { accountNo: `%${q}%` })
        .orWhere("client.commencementDate ILike :commencementDate", { commencementDate: `%${q}%` })
    }))
    }

    const query = queryBuilder
      .where('client.disabled = :disabled', { disabled: false })
      .andWhere('client.deleted =:deleted', { deleted: false })
      .andWhere('client.accountCode =:accountCode', {accountCode})
      .orderBy('client.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const [clients, clientsCount] = await query.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: clientsCount,
    });

    const result = new ClientPageDto(clients.toDtos(), pageMetaDto);
    return result;
  }

  public async getClientByIdAsync(id: string): Promise<ClientDto> {
    const queryBuilder = await this._clientRepository.createQueryBuilder('client');

    const query = queryBuilder.where('client.id = :id', { id });
    const client = await query.getOne();
    
    if(!client){
      return null;
    }

    return client.toDto();
  }

  public async createClientAsync(client: ClientDto, user: UserEntity): Promise<InsertResult> {
    const queryBuilder = await this._clientRepository.createQueryBuilder('client');
    
    client.createdBy = user.email;
    client.accountCode = user.accountCode;
    
    const result = await queryBuilder
      .insert()
      .values({ ...client })
      .returning([...Object.keys(client)])
      .execute();

    return result;
  }

  public async updateClientAsync(id: string, client: ClientUpdateDto, user: UserEntity): Promise<ClientDto> {
    const queryBuilder = await this._clientRepository.createQueryBuilder('client');

    if (!client) {
      throw new BadRequestException('Client does not exist');
    }

    if (id) {
      throw new BadRequestException('Client does not exist');
    }

    client.updatedBy = user.email;

    await queryBuilder
      .update()
      .set({ ...client })
      .where('id =:id', { id})
      .execute();

    const updatedClient = await this.getClientByIdAsync(id);
    return updatedClient;
  }

  public async deleteClientAsync(id: string): Promise<DeleteResult> {
    const queryBuilder = await this._clientRepository.createQueryBuilder('client' );

    if (!id) {
      throw new BadRequestException('Client does not exist');
    }

    const result = await queryBuilder.delete().where('id =:id', { id }).execute();
    return result;
  }

  public async deleteSoftAsync(id: string, user: UserEntity): Promise<DeleteResult> {
    const queryBuilder = await this._clientRepository.createQueryBuilder('client' );

    if (!id) {
      throw new BadRequestException('Client does not exist');
    }

    const clientToDelete = await this.getClientByIdAsync(id);
    if(!clientToDelete){
      throw new BadRequestException('Client does not exist');
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
