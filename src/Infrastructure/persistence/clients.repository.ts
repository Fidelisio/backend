import { InjectModel } from '@nestjs/mongoose';
import { IClient, ICustomer } from 'CRM/models';
import { IClientRepository } from 'CRM/repositories';
import { Model } from 'mongoose';

import { ClientModel } from './schemas/client.schema';

export class ClientsRepository implements IClientRepository {
    constructor(@InjectModel(ClientModel.name) private clientModel: Model<ClientModel>) {}

    public async findByCustomer(customer: string | ICustomer): Promise<IClient> {
        return;
    }

    public async insertOne(client: IClient): Promise<IClient> {
        const newClient = new this.clientModel(client);

        return newClient.save();
    }
}
