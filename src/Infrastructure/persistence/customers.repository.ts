import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Customer } from "src/CRM/Domain/customer.model";

@Injectable()
export class CustomerRepository {
    constructor(@InjectModel('CustomerModel') private customerModel: Model<Customer>) { }

    // only used for the init process, do not re-use!
    public async findFirst(): Promise<Customer> {
        return this.customerModel.findOne();
    }

    public async insertOne(customer: Customer) {
        const newCustomer = new this.customerModel(customer);
        await newCustomer.save();

        return newCustomer;
    }

    public async findByName(name: string): Promise<Customer> {
        return await this.customerModel.findOne({ name });
    }
}