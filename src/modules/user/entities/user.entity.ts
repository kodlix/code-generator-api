import { RoleType } from 'common/constants';
import { AbstractEntity } from 'common/entities';
import { UserDto } from 'modules/user/dtos';
import {
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import { UserAuthForgottenPasswordEntity } from './user-auth-forgotten-password.entity';

@Entity({ name: 'User' })
export class UserEntity extends AbstractEntity<UserDto> {

  @Column()
  businessName: string;
    
  @Column({ unique: true })
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column()
  accountCode: string; 

  @Column({ type: 'enum', enum: RoleType, default: RoleType.SUPER_ADMIN })
  role: RoleType;

  @Column()
  password: string;

  @Column({ nullable: true })
  commencementDate?: Date;

  @Column({ nullable: true })
  lastSuccessfulLoggedDate?: Date;

  @Column({ nullable: true })
  lastFailedLoggedDate?: Date;

  @Column({ nullable: true })
  lastLogoutDate?: Date;

  @Column({ nullable: true })
  lastPresentLoggedDate?: Date;

  @OneToMany(
    () => UserAuthForgottenPasswordEntity,
    (UserAuthForgottenPassword: UserAuthForgottenPasswordEntity) =>
      UserAuthForgottenPassword.user,
    { cascade: true },
  )
  public userAuthForgottenPassword?: UserAuthForgottenPasswordEntity[];

   dtoClass = UserDto;
}
