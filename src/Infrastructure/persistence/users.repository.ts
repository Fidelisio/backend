import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'CRM/models/user.model';
import { IUsersRepository } from 'CRM/repositories/users.repository';
import { UserModel } from 'Infrastructure/persistence/schemas/user.schema';
import { Model } from 'mongoose';

export class UsersRepository implements IUsersRepository {
    constructor(@InjectModel(UserModel.name) private userModel: Model<UserModel>) {}

    public async findAll(): Promise<IUser[]> {
        return this.userModel.find().exec();
    }

    public async findByUsername(username: string, withCustomer = false): Promise<IUser> {
        const req = this.userModel.findOne({ username });
        if (withCustomer) {
            req.populate('customer');
        }

        return req.exec();
    }

    public async insertOne(user: IUser): Promise<IUser> {
        const newUser = new this.userModel(user);

        return newUser.save();
    }
}
