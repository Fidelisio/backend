import { Module } from '@nestjs/common';
import { CustomersService, ICustomersService } from 'CRM/services/customers.service';
import { IUsersService, UsersService } from 'CRM/services/users.service';

import { RegistrationUsecase } from './usecases/registration.usecase';

const usecases = [RegistrationUsecase];

const appServices = [
    { provide: ICustomersService, useClass: CustomersService },
    { provide: IUsersService, useClass: UsersService },
];

@Module({
    providers: [...appServices, ...usecases],
    exports: [...usecases],
})
export class CrmModule {}
