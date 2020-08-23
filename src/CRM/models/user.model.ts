import { ICustomer } from 'CRM/models/customer.model';

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    DISABLED = 'DISABLED',
    DELETED = 'DELETED',
}

export interface IUser {
    username: string;
    password?: string;
    status: string;
    customer: ICustomer;
}
