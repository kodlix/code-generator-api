import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientCreditHandlingSettingController } from './controllers';
import { ClientCreditHandlingSettingRepository } from './repositories';
import { ClientCreditHandlingSettingService } from './services';

@Module({
    imports: [TypeOrmModule.forFeature([ClientCreditHandlingSettingRepository])],
    controllers: [ClientCreditHandlingSettingController],
    exports: [ClientCreditHandlingSettingService],
    providers: [ClientCreditHandlingSettingService],
})
export class ClientCreditHandlingSettingModule {}
