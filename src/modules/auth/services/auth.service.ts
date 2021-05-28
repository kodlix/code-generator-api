import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  UserNotFoundException,
  UserPasswordNotValidException,
} from 'exceptions';
import {
  ForgottenPasswordPayloadDto,
  TokenPayloadDto,
  UserForgottenPasswordDto,
  UserLoginDto,
} from 'modules/auth/dtos';
import {
  UserAuthForgottenPasswordEntity,
  UserEntity,
} from 'modules/user/entities';
import {
  UserAuthForgottenPasswordService,
  UserAuthService,
  UserService,
} from 'modules/user/services';
import { ContextService } from 'providers';
import { UtilityService } from 'utils/services';
import { ConfigService } from '@nestjs/config';
import {
  ForgottenTokenHasUsedException,
  WrongCredentialsProvidedException,
} from '../exceptions';

@Injectable()
export class AuthService {
  private static _authUserKey = 'user_key';

  constructor(
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
    private readonly _userService: UserService,
    private readonly _userAuthService: UserAuthService,
    private readonly _userAuthForgottenPasswordService: UserAuthForgottenPasswordService,
  ) {}

  public async createToken(user: UserEntity): Promise<TokenPayloadDto> {
    const {
      id,
       role,
    } = user;

    return new TokenPayloadDto({
      expiresIn: this._configService.get('JWT_EXPIRATION_TIME'),
      accessToken: await this._jwtService.signAsync({ id, role }),
    });
  }

  public async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const { email, password } = userLoginDto;
    let user = await this._userAuthService.findUserAuth(email);

    if (!user) {
      throw new UserNotFoundException();
    }

    const isPasswordValid = await UtilityService.validateHash(
      password,
      user.password,
    );

    // user = await this._userAuthService.updateLastLoggedDate(
    //   user,
    //   isPasswordValid,
    // );

    if (!isPasswordValid) {
      throw new UserPasswordNotValidException();
    }

    return user;
  }

  public static setAuthUser(user: UserEntity): void {
    ContextService.set(AuthService._authUserKey, user);
  }

  public static getAuthUser(): UserEntity {
    return ContextService.get(AuthService._authUserKey);
  }

  public async handleForgottenPassword(
    userForgottenPasswordDto: UserForgottenPasswordDto,
  ): Promise<void> {
    const { user, token } = await this._createForgottenPasswordToken(
      userForgottenPasswordDto,
    );

    const url = `https://bank.pietrzakadrian.com/password/reset/${token}`;

    return this._userAuthForgottenPasswordService.sendEmailWithToken(
      user,
      url,
      userForgottenPasswordDto.locale,
    );
  }

  public async handleResetPassword(
    password: string,
    userAuthForgottenPasswordEntity: UserAuthForgottenPasswordEntity,
  ): Promise<void> {
    console.log(
      'userAuthForgottenPasswordEntity',
      userAuthForgottenPasswordEntity,
    );

    if (userAuthForgottenPasswordEntity.used) {
      throw new ForgottenTokenHasUsedException();
    }

    await Promise.all([
      this._userAuthForgottenPasswordService.changeTokenActiveStatus(
        userAuthForgottenPasswordEntity,
        true,
      ),
      this._userAuthService.updatePassword(
        userAuthForgottenPasswordEntity.user,
        password,
      ),
    ]);
  }

  public async validateForgottenPasswordToken(
    forgottenPassword: UserAuthForgottenPasswordEntity,
    token: string,
  ): Promise<void> {
    const isForgottenPasswordTokenMatching = await UtilityService.validateHash(
      token,
      forgottenPassword.hashedToken,
    );

    if (!isForgottenPasswordTokenMatching) {
      throw new WrongCredentialsProvidedException();
    }
  }

  private async _createForgottenPasswordToken({
    emailAddress,
    locale,
  }: UserForgottenPasswordDto): Promise<ForgottenPasswordPayloadDto> {
    const user = await this._userService.getUser({ email: emailAddress });

    if (!user) {
      throw new WrongCredentialsProvidedException();
    }

    const hashedToken = await this._getJwtForgottenPasswordAccessToken({
      uuid: user.id,
    });

    await this._userAuthForgottenPasswordService.createForgottenPassword({
      hashedToken,
      user,
      emailAddress,
      locale,
    });

    return new ForgottenPasswordPayloadDto(hashedToken, user);
  }

  private async _getJwtForgottenPasswordAccessToken(payload): Promise<string> {
    const token = await this._jwtService.signAsync(payload, {
      secret: this._configService.get('JWT_FORGOTTEN_PASSWORD_TOKEN_SECRET'),
      expiresIn: `${this._configService.get(
        'JWT_FORGOTTEN_PASSWORD_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    return token;
  }
}
