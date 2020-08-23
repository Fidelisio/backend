import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer, ICustomer } from 'CRM/models/customer.model';
import { Model } from 'mongoose';

@Injectable()
export class CustomerRepository {
    constructor(@InjectModel('CustomerModel') private customerModel: Model<Customer>) {}

    // only used for the init process, do not re-use!
    public async findFirst(): Promise<ICustomer> {
        return this.customerModel.findOne();
    }

    public async insertOne(customer: ICustomer): Promise<ICustomer> {
        const newCustomer = new this.customerModel(customer);

        return newCustomer.save();
    }

    public async findByName(name: string): Promise<ICustomer> {
        return await this.customerModel.findOne({ name });
    }
}
