import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleType } from 'common/constants';
import { AbstractCheckDto } from 'common/dtos';
import { AuthUser, Roles } from 'decorators';
import { AuthJwtGuard, RolesGuard } from 'guards';
import { AuthUserInterceptor } from 'interceptors';
import { UserEntity } from 'modules/user/entities';
import { UserService } from 'modules/user/services';
import { UserDto, UserUpdateDto } from 'modules/user/dtos';

@Controller('user')
@ApiTags('User')
@UseInterceptors(AuthUserInterceptor)
@UseGuards(AuthJwtGuard)
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly _userService: UserService,
  ) {}

  @Get('/')
  @Roles(RoleType.USER, RoleType.ADMIN, RoleType.ROOT)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get user',
    type: UserDto,
  })
  async getUserData(@AuthUser() user: UserEntity): Promise<UserDto> {
    const userEntity = await this._userService.getUser({ id: user.id });
    return userEntity.toDto();
  }

  @Patch('/')
  @UseGuards(AuthJwtGuard, RolesGuard)
  @UseInterceptors(AuthUserInterceptor)
  @ApiBearerAuth()
  @Roles(RoleType.USER, RoleType.ADMIN, RoleType.ROOT)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update user',
    type: UserDto,
  })
  async setUserData(
    @AuthUser() user: UserEntity,
    @Body() userUpdateDto: UserUpdateDto,
  ): Promise<UserDto> {
    const userWithNewData = await this._userService.updateUserData(
      user,
      userUpdateDto,
    );
    return userWithNewData.toDto();
  }

  @Get('/:email/checkEmail')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get user',
    type: AbstractCheckDto,
  })
  async checkEmail(@Param('email') email: string): Promise<AbstractCheckDto> {
    const userEmail = await this._userService.getUser({
      email: email.toLocaleLowerCase(),
    });
    return new AbstractCheckDto(userEmail);
  }
}
