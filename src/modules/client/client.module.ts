import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './controllers';
import { ClientRepository } from './repositories';
import { ClientService } from './services';

@Module({
    imports: [TypeOrmModule.forFeature([ClientRepository])],
    controllers: [ClientController],
    exports: [ClientService],
    providers: [ClientService],
})
export class ClientModule {}
