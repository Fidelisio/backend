import { Module } from '@nestjs/common';

import { UsersController } from './controllers/users.controllers';
import { CustomersService } from './services/customers.service';
import { UsersService } from './services/users.service';

@Module({
    controllers: [UsersController],
    providers: [CustomersService, UsersService],
})
export class CrmModule {}
