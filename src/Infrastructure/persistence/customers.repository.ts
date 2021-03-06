import { InjectModel } from '@nestjs/mongoose';
import { ICustomer } from 'CRM/models';
import { ICustomerRepository } from 'CRM/repositories';
import { CustomerModel } from 'Infrastructure/persistence/schemas';
import { Model } from 'mongoose';

export class CustomerRepository implements ICustomerRepository {
    constructor(@InjectModel(CustomerModel.name) private customerModel: Model<CustomerModel>) {}

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
