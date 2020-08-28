import { Module } from '@nestjs/common';
import {
    ClientsService,
    CustomersService,
    IClientService,
    ICustomersService,
    IUsersService,
    UsersService,
} from 'CRM/services';

import { CustomerAlreadyExists } from './services/validators/customer-already-exists.validator';
import { UsernameAlreadyExists } from './services/validators/username-already-exists.validator';
import { RegistrationUsecase } from './usecases/registration.usecase';

const usecases = [RegistrationUsecase];

const appServices = [
    { provide: IClientService, useClass: ClientsService },
    { provide: ICustomersService, useClass: CustomersService },
    { provide: IUsersService, useClass: UsersService },
];

const validators = [CustomerAlreadyExists, UsernameAlreadyExists];

@Module({
    providers: [...appServices, ...usecases, ...validators],
    exports: [...usecases, ...appServices],
})
export class CrmModule {}
