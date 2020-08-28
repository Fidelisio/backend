import { Injectable } from '@nestjs/common';
import { ClientStatus, IClient, ICustomer } from 'CRM/models';
import { IClientRepository } from 'CRM/repositories';

export abstract class newClientDTO {}

export abstract class IClientService {
    public abstract async create(customer: ICustomer, data: Partial<IClient>): Promise<IClient>;
}

@Injectable()
export class ClientsService {
    constructor(private readonly clientRepository: IClientRepository) {}

    public async create(customer: ICustomer, clientData: Partial<IClient>): Promise<IClient> {
        const client = { ...clientData, customer, status: ClientStatus.ACTIVE } as IClient;

        client.contacts[0].isMain = true;
        if (client.addresses[0] !== undefined) {
            client.addresses[0].isMain = true;
        }

        return this.clientRepository.insertOne(client);
    }
}
