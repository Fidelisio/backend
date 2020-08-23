import { Injectable } from '@nestjs/common';
import { AuthService } from 'Auth/auth.service';
import { RegistrationDTO } from 'CRM/dtos/registration.dto';
import { ICustomer } from 'CRM/models/customer.model';
import { IUser, UserStatus } from 'CRM/models/user.model';
import { CustomersService } from 'CRM/services/customers.service';
import { UsersRepository } from 'Infrastructure/persistence/users.repository';

@Injectable()
export class UsersService {
    constructor(
        private readonly customerService: CustomersService,
        private readonly authService: AuthService,
        private readonly userRepository: UsersRepository,
    ) {}

    public async register(registrationDTO: RegistrationDTO): Promise<[IUser, ICustomer]> {
        const customer = await this.customerService.create({
            name: registrationDTO.customerName,
        } as Partial<ICustomer>);
        const user = await this.create({
            username: registrationDTO.username,
            password: this.authService.generatePassword(registrationDTO.password),
            customer: customer,
        } as Partial<IUser>);

        return [user, customer];
    }

    public async create(userData: Partial<IUser>): Promise<IUser> {
        const user = { ...userData, status: UserStatus.ACTIVE } as IUser;

        return this.userRepository.insertOne(user);
    }
}
