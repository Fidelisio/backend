import { Customer } from 'CRM/models/customer.model';
import { Document } from 'mongoose';

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    DISABLED = 'DISABLED',
    DELETED = 'DELETED',
}

export interface IUser {
    username: string;
    password?: string;
    status: string;
    customer: Customer;
}

export class User extends Document implements IUser {
    username: string;
    password: string;
    status: UserStatus;
    customer: Customer;

    constructor(init?: Partial<IUser>) {
        super();

        Object.assign(this, init);
    }
}
