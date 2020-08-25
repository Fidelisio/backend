export enum CustomerStatus {
    ACTIVE = 'ACTIVE',
    DISABLED = 'DISABLED',
    DELETED = 'DELETED',
}

export interface ICustomer {
    _id?: any;
    name: string;
    status: CustomerStatus;
    isAdmin: boolean;
}
