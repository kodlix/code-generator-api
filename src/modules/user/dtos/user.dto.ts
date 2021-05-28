import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Order, RoleType } from 'common/constants';
import { AbstractDto } from 'common/dtos';
import { UserEntity } from 'modules/user/entities';

export class UserDto extends AbstractDto {
  @ApiProperty()
  readonly firstName: string;

  @ApiProperty()
  readonly lastName: string;

  @ApiPropertyOptional()
  readonly email?: string;

  @ApiProperty()
  readonly avatar: string;

  @ApiProperty()
  readonly businessName: string;

  @ApiProperty({ type: 'enum', enum: RoleType})
  @IsEnum(RoleType)
  @IsOptional()
  readonly role: RoleType
  accountCode?: string;


  constructor(user: UserEntity) {
    super();
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.avatar = user.avatar;
    this.businessName = user.businessName
    this.role = user.role,
    this.accountCode = user.accountCode
  }
}
