import { Injectable } from '@nestjs/common';
import {
  CreateFailedException,
  EmailAddressExistException,
} from 'exceptions';
import { UserRegisterDto } from 'modules/auth/dtos';
import { UserUpdateDto } from 'modules/user/dtos';
import { UserEntity } from 'modules/user/entities';
import { UserRepository } from 'modules/user/repositories';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { UserAuthService } from './user-auth.service';

@Injectable()
export class UserService {  
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _userAuthService: UserAuthService,
  ) {}

  @Transactional()
  public async createUser(
    userRegisterDto: UserRegisterDto,
  ): Promise<UserEntity> {
    try {
      userRegisterDto.createdBy = "administrator@gmail.com";
      const newUser = Object.assign(new UserEntity(), userRegisterDto);
      const user = this._userRepository.create(newUser);
      await this._userRepository.save(user);

      // const createdUser = { ...userRegisterDto, user };
      // await Promise.all([
      //   this._userAuthService.createUserAuth(createdUser),
      // ]);

      return this.getUser({ id: user.id });
    } catch (error) {
      throw new CreateFailedException(error);
    }
  }

  public async getUser(
    options: Partial<{ id: string; email: string }>,
  ): Promise<UserEntity | undefined> {
    const queryBuilder = this._userRepository.createQueryBuilder('user');

    if (options.id) {
      queryBuilder
        .where('user.id = :id', { id: options.id });
    }

    if (options.email) {
      queryBuilder.orWhere('user.email = :email', {
        email: options.email,
      });
    }
    return queryBuilder.getOne();
  }

  public async getUsersCount(): Promise<number> {
    const queryBuilder = this._userRepository.createQueryBuilder('user');
    return queryBuilder.getCount();
  }

  public async updateUserData(
    user: UserEntity,
    userUpdateDto: UserUpdateDto,
  ): Promise<UserEntity> {
    if (userUpdateDto.email) {
      const isEmail = await this.getUser({ email: userUpdateDto.email });

      if (isEmail) {
        throw new EmailAddressExistException();
      }

      await this._userRepository.update(user.id, {
        email: userUpdateDto.email,
      });
    }

    if (userUpdateDto.lastName) {
      await this._userRepository.update(user.id, {
        lastName: userUpdateDto.lastName,
      });
    }

    if (userUpdateDto.password) {
      await this._userAuthService.updatePassword(
        user,
        userUpdateDto.password,
      );
    }

    return this.getUser({ id: user.id });
  }
}
