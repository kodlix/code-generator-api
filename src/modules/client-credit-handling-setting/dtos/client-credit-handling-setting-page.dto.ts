import { ApiProperty } from "@nestjs/swagger";
import { PageMetaDto } from "common/dtos";
import { ClientCreditHandlingSettingDto } from ".";

export class ClientCreditHandlingSettingPageDto {
    @ApiProperty({
      type: ClientCreditHandlingSettingDto,
      isArray: true,
    })
    readonly data: ClientCreditHandlingSettingDto[];
  
    @ApiProperty()
    readonly meta: PageMetaDto;
  
    constructor(data: ClientCreditHandlingSettingDto[], meta: PageMetaDto) {
      this.data = data;
      this.meta = meta;
    }
  }