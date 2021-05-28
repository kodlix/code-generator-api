import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class ClientUpdateDto{
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clientName:	string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address:	string;	

  @ApiProperty()
  url:	string;	

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contactPerson:	string;	

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  accountNo:	number;	

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  commencementDate:	Date;
  
  @ApiProperty()
  @IsOptional()
  suspendOperation:	boolean;

  @ApiProperty()
  @IsOptional()
  supportAutoBusinessDay:	boolean;

  @ApiProperty()
  @IsOptional()
  clientLogoUrl: string;

  @ApiProperty()
  @IsOptional()
  uploadProperties: 	string

  @ApiProperty()
  @IsOptional()
  clientCodeOriginal:	string;	

  @ApiProperty()
  @IsOptional()
  clientShortCodeOriginal:	string;	

  updatedBy:	string;	

}
