import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    ValidationPipe
} from '@nestjs/common';
import {ApiBearerAuth, ApiResponse, ApiTags} from '@nestjs/swagger';
import {AuthUser} from 'decorators';
import {UserEntity} from 'modules/user/entities';
import {ClientContactPersonDto, ClientContactPersonPageDto, ClientContactPersonPageOptionsDto} from '../dtos';
import {ClientContactPersonService} from '../services';
import {FilterDto} from 'common/dtos/filter.dto';
import { AuthJwtGuard } from 'guards/auth.guard';
import { ClientContactPersonUpdateDto } from '../dtos/client-contact-person-update.dto';

@Controller('client-contact-person')
@ApiTags('client-contact-person')
@UseGuards(AuthJwtGuard)
@ApiBearerAuth()
export class ClientContactPersonController {
    constructor(private readonly _clientContactPersonService : ClientContactPersonService) {}

    @Get('/')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: HttpStatus.OK, description: "Get client contact persons", type: ClientContactPersonPageDto})
    async getClientContactPersons(
      @Query(new ValidationPipe({transform: true}))pageOptionsDto : ClientContactPersonPageOptionsDto,
      @Query()filterDto : FilterDto, @AuthUser()user : UserEntity): Promise<ClientContactPersonPageDto | undefined | any> {
        return this._clientContactPersonService.getClientContactPersonsASync(user.id, pageOptionsDto, filterDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: HttpStatus.OK, description: "Get client contact person", type: ClientContactPersonDto})
    async getSingleClientContactPerson(@Param('id') id: string): Promise<ClientContactPersonDto> {
        return await this._clientContactPersonService.getClientContactPersonByIdAsync(id);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: HttpStatus.OK,description: 'Create new  client contact person',type: ClientContactPersonDto })
    async createClientContactPerson( @Body() clientContactPerson: ClientContactPersonDto, @AuthUser() user: UserEntity): Promise<ClientContactPersonDto | any> {
        return await this._clientContactPersonService.createClientContactPersonAsync(clientContactPerson, user);
    }
    

    @Put(':id')
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: HttpStatus.OK,description: 'Update  existing client contact person',type: ClientContactPersonUpdateDto })
    async updateClientContactPerson(id, @Body() clientContactPerson: ClientContactPersonUpdateDto, @AuthUser() user: UserEntity,): Promise<ClientContactPersonDto> {
        return await this._clientContactPersonService.updateClientContactPersonAsync(id, clientContactPerson, user);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: HttpStatus.OK, description: "delete client contact person", type: ClientContactPersonDto})
    async deleteClientContactPerson(@Param('id') id: string): Promise<ClientContactPersonDto | any> {
        return await this._clientContactPersonService.deleteClientContactPersonAsync(id);
    }
}
