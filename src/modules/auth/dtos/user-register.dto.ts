import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { RoleType } from 'common/constants';
import { UtilityService } from 'utils/services';

export class UserRegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly lastName: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly phoneNumber: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ minLength: 6 })
  readonly password: string;

  @IsString()
  @IsNotEmpty({message: "Role is required"})
  @IsEnum(RoleType, {message: "Enter a valid user role" })
  @ApiProperty()
  readonly role: RoleType;

  @IsString()
  @MinLength(5)
  @ApiProperty({ minLength: 5 })
  readonly businessName: string;

  code?: string;  
  createdBy?: string;
  accountCode?: string;
}
