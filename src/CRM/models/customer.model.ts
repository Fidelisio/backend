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
