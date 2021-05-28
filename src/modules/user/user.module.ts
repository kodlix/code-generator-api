import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'modules/auth/auth.module';
import { UserController } from 'modules/user/controllers';
import {
  UserAuthForgottenPasswordRepository,
  UserAuthRepository,
  UserRepository,
} from 'modules/user/repositories';
import {
  UserAuthForgottenPasswordService,
  UserAuthService,
  UserService,
} from 'modules/user/services';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([
      UserRepository,
      UserAuthRepository,
      UserAuthForgottenPasswordRepository
    ]),
  ],
  controllers: [UserController],
  exports: [
    UserAuthService,
    UserService,
    UserAuthForgottenPasswordService,
  ],
  providers: [
    UserAuthService,
    UserService,
    UserAuthForgottenPasswordService,
  ],
})
export class UserModule {}
