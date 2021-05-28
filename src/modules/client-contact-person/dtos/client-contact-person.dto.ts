import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEmail, IsUrl, IsFQDN } from 'class-validator';
import { AbstractDto } from 'common/dtos';

export class ClientContactPersonDto extends AbstractDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  clientId:	string;
 
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  clientCode:	string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contactPersion: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  designation:	string;
  
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email:	string;	

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber:	string;	

  @ApiProperty()
  @IsString()
  @IsOptional()
  alternatePhoneNumber:	string;	

  @ApiProperty()
  @IsFQDN()
  @IsOptional()
  website:	string;	

  @ApiProperty()
  @IsString()
  @IsOptional()
  faxNumber:	string;	
}
