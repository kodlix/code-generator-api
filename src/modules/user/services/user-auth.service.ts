import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { RoleType } from 'common/constants';
import { CreateFailedException } from 'exceptions';
import { UserEntity } from 'modules/user/entities';
import { UserAuthRepository, UserRepository } from 'modules/user/repositories';
import { UserService } from 'modules/user/services';
import { UpdateResult } from 'typeorm';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly _userAuthRepository: UserAuthRepository,
    private readonly _userRepostiory: UserRepository,
    @Inject(forwardRef(() => UserService)) private readonly _userService: UserService
  ) {}

  public async updateLastLoggedDate(user: UserEntity,isSuccessiveLogged: boolean): Promise<UserEntity> {
    const { lastSuccessfulLoggedDate,lastPresentLoggedDate } = user;

    if (!isSuccessiveLogged) {
      await this._updateLastFailedLoggedDate(user);
    } else if (isSuccessiveLogged && !lastSuccessfulLoggedDate) {
      await Promise.all([
        this._updateLastSuccessfulLoggedDate(user),
      ]);
    } else {
      await Promise.all([
        this._updateLastSuccessfulLoggedDate(user, lastPresentLoggedDate),
      ]);
    }

    return this._userService.getUser({ id: user.id });
  }

  public async updateLastLogoutDate(user: UserEntity): Promise<UpdateResult> {
    const queryBuilder = this._userAuthRepository.createQueryBuilder('user');

    return queryBuilder
      .update()
      .set({ lastLogoutDate: new Date() })
      .where('id = :id', { id: user.id })
      .execute();
  }

  public async updateRole( user: UserEntity,role: RoleType): Promise<UpdateResult> {
    const queryBuilder = this._userAuthRepository.createQueryBuilder('user');

    return queryBuilder
      .update()
      .set({ role })
      .where('id = :id', { id: user.id })
      .execute();
  }

  public async updatePassword(user: UserEntity, password: string ): Promise<UpdateResult> {
    const queryBuilder = this._userAuthRepository.createQueryBuilder('user' );

    return queryBuilder
      .update()
      .set({ password })
      .where('id = :id', { id: user.id })
      .execute();
  }

  public async findUserAuth(email: string): Promise<UserEntity | undefined> {
    const queryBuilder = this._userRepostiory.createQueryBuilder('user');

    if (!email) {      
      throw new BadRequestException("email is required");
    }
    queryBuilder.where("user.email=:email", {email});
    return queryBuilder.getOne();
  }

  private async _updateLastFailedLoggedDate(user: UserEntity): Promise<UpdateResult> {
    const queryBuilder = this._userAuthRepository.createQueryBuilder('user');

    return queryBuilder
      .update()
      .set({ lastFailedLoggedDate: new Date() })
      .where('id = :id', { id: user.id })
      .execute();
  }

  private async _updateLastSuccessfulLoggedDate( user: UserEntity, lastPresentLoggedDate?: Date): Promise<UpdateResult> {
    const queryBuilder = this._userAuthRepository.createQueryBuilder('user');

    return queryBuilder
      .update()
      .set({ lastSuccessfulLoggedDate: lastPresentLoggedDate ?? new Date() })
      .where('id = :id', { id: user.id })
      .execute();
  }


}
