import { Injectable } from '@nestjs/common';
import { IUser, UserStatus } from 'CRM/models/user.model';
import { IUsersRepository } from 'CRM/repositories/users.repository';

export abstract class IUsersService {
    public abstract async create(data: Partial<IUser>): Promise<IUser>;
}

@Injectable()
export class UsersService implements IUsersService {
    constructor(private readonly userRepository: IUsersRepository) {}

    public async create(userData: Partial<IUser>): Promise<IUser> {
        const user = { ...userData, status: UserStatus.ACTIVE } as IUser;

        return this.userRepository.insertOne(user);
    }
}
