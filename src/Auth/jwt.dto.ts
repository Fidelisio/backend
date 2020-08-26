import { ICustomer } from 'CRM/models';

export interface JwtDTO {
    _id: any;
    username: string;
    customer: ICustomer;
}
