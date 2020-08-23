import { Injectable } from '@nestjs/common';
import { AuthService } from 'Auth/auth.service';
import { RegistrationDTO } from 'CRM/dtos/registration.dto';
import { ICustomer } from 'CRM/models/customer.model';
import { IUser } from 'CRM/models/user.model';
import { ICustomersService } from 'CRM/services/customers.service';
import { IUsersService } from 'CRM/services/users.service';

@Injectable()
export class RegistrationUsecase {
    constructor(
        private readonly userService: IUsersService,
        private readonly customerService: ICustomersService,
        private readonly authService: AuthService,
    ) {}

    public async execute(registrationDTO: RegistrationDTO): Promise<IUser> {
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
