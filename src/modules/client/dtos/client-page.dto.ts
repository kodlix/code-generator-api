import { ApiProperty } from "@nestjs/swagger";
import { PageMetaDto } from "common/dtos";
import { ClientDto } from ".";

export class ClientPageDto {
    @ApiProperty({
      type: ClientDto,
      isArray: true,
    })
    readonly data: ClientDto[];
  
    @ApiProperty()
    readonly meta: PageMetaDto;
  
    constructor(data: ClientDto[], meta: PageMetaDto) {
      this.data = data;
      this.meta = meta;
    }
  }