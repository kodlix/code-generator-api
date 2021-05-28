import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientContactPersonController } from './controllers';
import { ClientContactPersonRepository } from './repositories';
import { ClientContactPersonService } from './services';

@Module({
    imports: [TypeOrmModule.forFeature([ClientContactPersonRepository])],
    controllers: [ClientContactPersonController],
    exports: [ClientContactPersonService],
    providers: [ClientContactPersonService],
})
export class ClientContactPersonModule {}
