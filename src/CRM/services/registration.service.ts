import { Injectable } from '@nestjs/common';
import { AuthService } from 'Auth/auth.service';
import { RegistrationDTO } from 'CRM/dtos/registration.dto';
import { ICustomer } from 'CRM/models/customer.model';
import { IUser } from 'CRM/models/user.model';

import { ICustomersService } from './customers.service';
import { IUsersService } from './users.service';

export abstract class IRegistrationService {
    public abstract async register(registrationDTO: RegistrationDTO): Promise<IUser>;
}

@Injectable()
export class RegistrationService implements IRegistrationService {
    constructor(
        private readonly userService: IUsersService,
        private readonly customerService: ICustomersService,
        private readonly authService: AuthService,
    ) {}

    public async register(registrationDTO: RegistrationDTO): Promise<IUser> {
        const customer = await this.customerService.create({
            name: registrationDTO.customerName,
        } as Partial<ICustomer>);

        return await this.userService.create({
            username: registrationDTO.username,
            password: this.authService.generatePassword(registrationDTO.password),
            customer: customer,
        } as Partial<IUser>);
    }
}
