import { ICustomer } from 'CRM/models';

export abstract class IClient {
    _id?: any;
    customer: ICustomer;
    name: string;
    addresses: IClientAddress[];
    contacts: IClientContact[];
    status: ClientStatus;
}

export enum ClientStatus {
    ACTIVE = 'ACTIVE',
    DELETED = 'DELETED',
}

export interface IClientContact {
    firstName: string;
    lastName: string;
    title: string;
    mobilePhone?: string;
    otherPhone?: string;
    email?: string;
    note?: string;
    isMain: boolean;
}

export interface IClientAddress {
    name?: string;
    streetAddress?: string;
    state?: string;
    city?: string;
    zipCode?: string;
    country?: string;
    note?: string;
    isMain?: boolean;
}
