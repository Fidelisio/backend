import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CrmModule } from 'CRM/crm.module';
import { ICustomerRepository } from 'CRM/repositories/customers.repository';
import { IUsersRepository } from 'CRM/repositories/users.repository';
import { CustomerRepository } from 'Infrastructure/persistence/customers.repository';
import { CustomerModel, CustomerSchema } from 'Infrastructure/persistence/schemas/customer.schema';
import { UserModel, UserSchema } from 'Infrastructure/persistence/schemas/user.schema';
import { UsersRepository } from 'Infrastructure/persistence/users.repository';

import { RegisterController } from './presentation/register.controller';

const repositories = [
    { provide: ICustomerRepository, useClass: CustomerRepository },
    { provide: IUsersRepository, useClass: UsersRepository },
];

@Global()
@Module({
    imports: [
        CrmModule,
        MongooseModule.forFeature([
            { name: CustomerModel.name, schema: CustomerSchema },
            { name: UserModel.name, schema: UserSchema },
        ]),
    ],
    controllers: [RegisterController],
    providers: [...repositories],
    exports: [...repositories],
})
export class InfrastructureModule {}
