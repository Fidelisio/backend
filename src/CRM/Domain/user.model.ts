import { Document } from "mongoose";
import { Customer } from "./customer.model";

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    DISABLED = 'DISABLED',
    DELETED = 'DELETED'
}

export class User extends Document {
    username: string;
    password: string;
    status: UserStatus;
    customer: Customer;
}