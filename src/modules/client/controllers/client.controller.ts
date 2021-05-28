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
import {ClientDto, ClientPageDto, ClientPageOptionsDto} from '../dtos';
import {ClientService} from '../services';
import {FilterDto} from 'common/dtos/filter.dto';
import { AuthJwtGuard } from 'guards/auth.guard';
import { ClientUpdateDto } from '../dtos/client-update.dto';

@Controller('client')
@ApiTags('client')
@UseGuards(AuthJwtGuard)
@ApiBearerAuth()
export class ClientController {
    constructor(private readonly _clientService : ClientService) {}

    @Get('/')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: HttpStatus.OK, description: "Get clients", type: ClientPageDto})
    async getClients(
      @Query(new ValidationPipe({transform: true}))pageOptionsDto : ClientPageOptionsDto,
      @Query()filterDto : FilterDto, @AuthUser()user : UserEntity): Promise<ClientPageDto | undefined | any> {
        return this._clientService.getClientsASync(user.id, pageOptionsDto, filterDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: HttpStatus.OK, description: "Get client", type: ClientDto})
    async getSingleClient(@Param('id') id: string): Promise<ClientDto> {
        return await this._clientService.getClientByIdAsync(id);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: HttpStatus.OK,description: 'Create new  client',type: ClientDto })
    async createClient( @Body() client: ClientDto, @AuthUser() user: UserEntity): Promise<ClientDto | any> {
        return await this._clientService.createClientAsync(client, user);
    }
    

    @Put(':id')
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: HttpStatus.OK,description: 'Update  existing client',type: ClientUpdateDto })
    async updateClient(id, @Body() client: ClientUpdateDto, @AuthUser() user: UserEntity,): Promise<ClientDto> {
        return await this._clientService.updateClientAsync(id, client, user);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: HttpStatus.OK, description: "delete client", type: ClientDto})
    async deleteClient(@Param('id') id: string): Promise<ClientDto | any> {
        return await this._clientService.deleteClientAsync(id);
    }
}
