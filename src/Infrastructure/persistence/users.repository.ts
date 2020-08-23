import { InjectModel } from '@nestjs/mongoose';
import { IUser, User } from 'CRM/models/user.model';
import { Model } from 'mongoose';

export class UsersRepository {
    constructor(@InjectModel('UserModel') private userModel: Model<User>) {}

    public async insertOne(user: IUser): Promise<IUser> {
        const newUser = new this.userModel(user);

        return newUser.save();
    }

    public async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    public async findByUsername(username: string, withCustomer = false): Promise<User> {
        const req = this.userModel.findOne({ username });
        if (withCustomer) {
            req.populate('customer');
        }

        return req.exec();
    }
}
