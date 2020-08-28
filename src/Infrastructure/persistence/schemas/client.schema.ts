import { ClientStatus, IClient, IClientAddress, IClientContact } from 'CRM/models/client.model';
import { ICustomer } from 'CRM/models/customer.model';
import { CustomerModel } from 'Infrastructure/persistence/schemas/customer.schema';
import { Document, Schema, Types } from 'mongoose';

export class ClientModel extends Document implements IClient {
    name: string;
    customer: ICustomer;
    addresses: IClientAddress[];
    contacts: IClientContact[];
    status: ClientStatus;

    constructor(init?: unknown) {
        super();

        Object.assign(this, init);
    }
}

export const ClientSchema = new Schema(
    {
        name: { type: String, required: true },
        customer: { type: Types.ObjectId, ref: CustomerModel.name, index: true },
        contacts: [
            {
                firstName: { type: String, required: true },
                lastName: { type: String, required: true },
                title: { type: String },
                mobilePhone: { type: String },
                otherPhone: { type: String },
                email: { type: String },
                note: { type: String },
                isMain: { type: Boolean },
            },
        ],
        addresses: [
            {
                name: { type: String },
                streetAddress: { type: String },
                city: { type: String },
                zipCode: { type: String },
                state: { type: String },
                country: { type: String },
                note: { type: String },
                isMain: { type: Boolean },
            },
        ],
        status: { type: String, required: true },
    },
    { collection: 'clients' },
);
