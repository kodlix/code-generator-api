import { UserEntity } from '../entities';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

@EntityRepository(UserEntity)
export class UserAuthRepository extends Repository<UserEntity> {}
