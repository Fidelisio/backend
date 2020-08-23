import { Injectable } from '@nestjs/common';
import { CustomerStatus, ICustomer } from 'CRM/models/customer.model';
import { CustomerRepository } from 'Infrastructure/persistence/customers.repository';

@Injectable()
export class CustomersService {
    constructor(private readonly customerRepository: CustomerRepository) {}

    public async create(customerData: Partial<ICustomer>): Promise<ICustomer> {
        return this.customerRepository.insertOne({
            ...customerData,
            status: CustomerStatus.ACTIVE,
        } as ICustomer);
    }
}
