import { ICustomer, IUser, UserStatus } from 'CRM/models';
import { Document, Schema, Types } from 'mongoose';

export class UserModel extends Document implements IUser {
    username: string;
    password: string;
    status: UserStatus;
    customer: ICustomer;

    constructor(init?: Partial<IUser>) {
        super();

        Object.assign(this, init);
    }
}

export const UserSchema = new Schema(
    {
        username: { type: String, unique: true },
        password: { type: String, required: true },
        customer: {
            type: Types.ObjectId,
            required: true,
            ref: 'CustomerModel',
        },
        status: { type: String, default: UserStatus.ACTIVE, required: true },
    },
    { collection: 'users' },
);
