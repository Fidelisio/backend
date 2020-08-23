import { IUser } from 'CRM/models/user.model';

export abstract class IUsersRepository {
    public abstract findByUsername(username: string, withCustomer?: boolean): Promise<IUser>;

    public abstract insertOne(data: IUser): Promise<IUser>;
}
