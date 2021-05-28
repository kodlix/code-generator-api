import { ClientCreditHandlingSettingEntity } from 'modules/client-credit-handling-setting/entities';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

@EntityRepository(ClientCreditHandlingSettingEntity)
export class ClientCreditHandlingSettingRepository extends Repository<ClientCreditHandlingSettingEntity> {}
