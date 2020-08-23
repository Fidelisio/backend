import { ICustomer } from 'CRM/models/customer.model';

export abstract class ICustomerRepository {
    abstract insertOne(customer: ICustomer): Promise<ICustomer>;
}
