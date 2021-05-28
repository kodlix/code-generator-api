import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class FilterDto {

    @ApiProperty()
    @ApiPropertyOptional()
    q: string;
}