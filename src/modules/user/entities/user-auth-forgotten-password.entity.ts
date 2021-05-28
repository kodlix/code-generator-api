import { AbstractEntity } from 'common/entities';
import { UserAuthForgottenPasswordDto } from '../dtos';
import { UserEntity } from '.';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'UserAuthForgotPassword' })
export class UserAuthForgottenPasswordEntity extends AbstractEntity<
  UserAuthForgottenPasswordDto
> {
  @Column({ default: false })
  public used: boolean;

  @Column()
  @Exclude()
  public hashedToken: string;

  @ManyToOne(
    () => UserEntity,
    (user: UserEntity) => user.userAuthForgottenPassword,
    { nullable: false },
  )
  @JoinColumn()
  public user: UserEntity;

  public dtoClass = UserAuthForgottenPasswordDto;
}
