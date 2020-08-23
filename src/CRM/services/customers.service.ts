import { Injectable } from '@nestjs/common';
import { CustomerStatus, ICustomer } from 'CRM/models/customer.model';
import { ICustomerRepository } from 'CRM/repositories/customers.repository';

export abstract class ICustomersService {
    public abstract async create(data: Partial<ICustomer>): Promise<ICustomer>;
}

@Injectable()
export class CustomersService implements ICustomersService {
    constructor(private readonly customerRepository: ICustomerRepository) {}

    public async create(customerData: Partial<ICustomer>): Promise<ICustomer> {
        return this.customerRepository.insertOne({
            ...customerData,
            status: CustomerStatus.ACTIVE,
        } as ICustomer);
    }
}
