import { Document } from 'mongoose';

export enum CustomerStatus {
    ACTIVE = 'ACTIVE',
    DISABLED = 'DISABLED',
    DELETED = 'DELETED',
}

export interface ICustomer {
    name: string;
    status: CustomerStatus;
    isAdmin: boolean;
}

export class Customer extends Document implements ICustomer {
    name: string;
    status: CustomerStatus;
    isAdmin: boolean;

    constructor(init?: Partial<ICustomer>) {
        super();

        Object.assign(this, init);
    }
}
