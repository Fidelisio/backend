import { Module } from '@nestjs/common';
import { CustomersService, ICustomersService } from 'CRM/services/customers.service';
import { IUsersService, UsersService } from 'CRM/services/users.service';

import { CustomerAlreadyExists } from './services/validators/customer-already-exists.validator';
import { UsernameAlreadyExists } from './services/validators/username-already-exists.validator';
import { RegistrationUsecase } from './usecases/registration.usecase';

const usecases = [RegistrationUsecase];

const appServices = [
    { provide: ICustomersService, useClass: CustomersService },
    { provide: IUsersService, useClass: UsersService },
];

const validators = [CustomerAlreadyExists, UsernameAlreadyExists];

@Module({
    providers: [...appServices, ...usecases, ...validators],
    exports: [...usecases],
})
export class CrmModule {}
