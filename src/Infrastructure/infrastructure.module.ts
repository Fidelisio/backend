import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CrmModule } from 'CRM/crm.module';
import { IClientRepository, ICustomerRepository, IUsersRepository } from 'CRM/repositories';
import { ClientsRepository, CustomerRepository, UsersRepository } from 'Infrastructure/persistence';
import {
    ClientModel,
    ClientSchema,
    CustomerModel,
    CustomerSchema,
    UserModel,
    UserSchema,
} from 'Infrastructure/persistence/schemas';
import { ClientsController, RegisterController } from 'Infrastructure/presentation';

const repositories = [
    { provide: IClientRepository, useClass: ClientsRepository },
    { provide: ICustomerRepository, useClass: CustomerRepository },
    { provide: IUsersRepository, useClass: UsersRepository },
];

@Global()
@Module({
    imports: [
        CrmModule,
        MongooseModule.forFeature([
            { name: ClientModel.name, schema: ClientSchema },
            { name: CustomerModel.name, schema: CustomerSchema },
            { name: UserModel.name, schema: UserSchema },
        ]),
    ],
    controllers: [ClientsController, RegisterController],
    providers: [...repositories],
    exports: [...repositories],
})
export class InfrastructureModule {}
