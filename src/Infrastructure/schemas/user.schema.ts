import { UserStatus } from 'CRM/models/user.model';
import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
    {
        username: { type: String, unique: true },
        password: { type: String, required: true },
        customer: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'CustomerModel',
        },
        status: { type: String, default: UserStatus.ACTIVE, required: true },
    },
    { collection: 'users' },
);
