import { ApiProperty } from "@nestjs/swagger";
import { PageMetaDto } from "common/dtos";
import { ClientContactPersonDto } from ".";

export class ClientContactPersonPageDto {
    @ApiProperty({
      type: ClientContactPersonDto,
      isArray: true,
    })
    readonly data: ClientContactPersonDto[];
  
    @ApiProperty()
    readonly meta: PageMetaDto;
  
    constructor(data: ClientContactPersonDto[], meta: PageMetaDto) {
      this.data = data;
      this.meta = meta;
    }
  }