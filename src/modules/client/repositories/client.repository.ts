import { ClientEntity } from 'modules/client/entities';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

@EntityRepository(ClientEntity)
export class ClientRepository extends Repository<ClientEntity> {}
