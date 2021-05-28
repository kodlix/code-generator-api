import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { AbstractDto } from 'common/dtos';

export class ClientCreditHandlingSettingDto extends AbstractDto {
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
  clientName:	string;

  @ApiProperty()
  @IsNotEmpty()
  allowCredit:	boolean;
  
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  maximumCreditDays:	number;

  @ApiProperty()
  @IsNumber()
  creditLimit: number;

  @ApiProperty()
  @IsOptional()
  allowMultipleCredit:	boolean;

  @ApiProperty()
  @IsOptional()
  enforceCreditDays:	boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  escalationValue:	number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  escalationDays?:	number;
}
