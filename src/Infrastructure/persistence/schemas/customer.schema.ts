import { CustomerStatus, ICustomer } from 'CRM/models/customer.model';
import { Document, Schema } from 'mongoose';

export class CustomerModel extends Document implements ICustomer {
    name: string;
    status: CustomerStatus;
    isAdmin: boolean;

    constructor(init?: Partial<ICustomer>) {
        super();

        Object.assign(this, init);
    }
}

export const CustomerSchema = new Schema(
    {
        name: { type: String, unique: true },
        status: {
            type: String,
            default: CustomerStatus.ACTIVE,
            uppercase: true,
            required: true,
        },
        isAdmin: { type: Boolean, required: true, default: false },
    },
    { collection: 'customers' },
);
