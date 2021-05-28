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
import {ClientCreditHandlingSettingDto, ClientCreditHandlingSettingPageDto, ClientCreditHandlingSettingPageOptionsDto} from '../dtos';
import {ClientCreditHandlingSettingService} from '../services';
import {FilterDto} from 'common/dtos/filter.dto';
import { AuthJwtGuard } from 'guards/auth.guard';
import { ClientCreditHandlingSettingUpdateDto } from '../dtos/client-credit-handling-setting-update.dto';

@Controller('client-credit-handling-setting')
@ApiTags('client-credit-handling-setting')
@UseGuards(AuthJwtGuard)
@ApiBearerAuth()
export class ClientCreditHandlingSettingController {
    constructor(private readonly _clientCreditHandlingSettingService : ClientCreditHandlingSettingService) {}

    @Get('/')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: HttpStatus.OK, description: "Get client credit handling setting", type: ClientCreditHandlingSettingPageDto})
    async getClientCreditHandlingSettings(
      @Query(new ValidationPipe({transform: true}))pageOptionsDto : ClientCreditHandlingSettingPageOptionsDto,
      @Query()filterDto : FilterDto, @AuthUser()user : UserEntity): Promise<ClientCreditHandlingSettingPageDto | undefined | any> {
        return this._clientCreditHandlingSettingService.getClientCreditHandlingSettingsASync(user.id, pageOptionsDto, filterDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: HttpStatus.OK, description: "Get client credit handling setting", type: ClientCreditHandlingSettingDto})
    async getSingleClientCreditHandlingSetting(@Param('id') id: string): Promise<ClientCreditHandlingSettingDto> {
        return await this._clientCreditHandlingSettingService.getClientCreditHandlingSettingByIdAsync(id);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: HttpStatus.OK,description: 'Create new  client credit handling setting',type: ClientCreditHandlingSettingDto })
    async createClientCreditHandlingSetting( @Body() client: ClientCreditHandlingSettingDto, @AuthUser() user: UserEntity): Promise<ClientCreditHandlingSettingDto | any> {
        return await this._clientCreditHandlingSettingService.createClientCreditHandlingSettingAsync(client, user);
    }
    

    @Put(':id')
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: HttpStatus.OK,description: 'Update  existing client credit handling setting',type: ClientCreditHandlingSettingUpdateDto })
    async updateClientCreditHandlingSetting(id, @Body() client: ClientCreditHandlingSettingUpdateDto, @AuthUser() user: UserEntity,): Promise<ClientCreditHandlingSettingDto> {
        return await this._clientCreditHandlingSettingService.updateClientCreditHandlingSettingAsync(id, client, user);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: HttpStatus.OK, description: "delete client credit handling setting", type: ClientCreditHandlingSettingDto})
    async deleteClientCreditHandlingSetting(@Param('id') id: string): Promise<ClientCreditHandlingSettingDto | any> {
        return await this._clientCreditHandlingSettingService.deleteClientCreditHandlingSettingAsync(id);
    }
}
