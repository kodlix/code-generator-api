import { ClientContactPersonEntity } from 'modules/client-contact-person/entities';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

@EntityRepository(ClientContactPersonEntity)
export class ClientContactPersonRepository extends Repository<ClientContactPersonEntity> {}
