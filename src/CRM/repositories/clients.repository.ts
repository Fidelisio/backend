import { ClientStatus } from 'CRM/models/client.model';
import { IClient } from 'CRM/models/client.model';
import { ICustomer } from 'CRM/models/customer.model';

export abstract class IClientRepository {
    abstract findByCustomer(customer: string | ICustomer, status: ClientStatus): Promise<IClient>;

    abstract insertOne(client: IClient): Promise<IClient>;
}
