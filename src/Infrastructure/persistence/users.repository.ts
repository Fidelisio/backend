import { InjectModel } from '@nestjs/mongoose';
import { User } from 'CRM/Domain/user.model';
import { Model } from 'mongoose';

export class UsersRepository {
    constructor(@InjectModel('UserModel') private userModel: Model<User>) {}

    public async insertOne(user: User): Promise<User> {
        const newUser = new this.userModel(user);
        await newUser.save();

        return user;
    }

    public async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    public async findByUsername(
        username: string,
        withCustomer = false,
    ): Promise<User> {
        const req = this.userModel.findOne({ username });
        if (withCustomer) {
            req.populate('customer');
        }

        return req.exec();
    }
}
