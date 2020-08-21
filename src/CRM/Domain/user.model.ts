import { Customer } from 'CRM/Domain/customer.model';
import { Document } from 'mongoose';

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    DISABLED = 'DISABLED',
    DELETED = 'DELETED',
}

export class User extends Document {
    username: string;
    password: string;
    status: UserStatus;
    customer: Customer;
}
