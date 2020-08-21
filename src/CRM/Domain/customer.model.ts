import { Document } from 'mongoose';

export enum CustomerStatus {
    ACTIVE = 'ACTIVE',
    DISABLED = 'DISABLED',
    DELETED = 'DELETED',
}

export class Customer extends Document {
    name: string;
    status: CustomerStatus;
    isAdmin: boolean;
}
