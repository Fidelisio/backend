import { CustomerStatus } from 'CRM/Domain/customer.model';
import * as mongoose from 'mongoose';

export const CustomerSchema = new mongoose.Schema(
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
