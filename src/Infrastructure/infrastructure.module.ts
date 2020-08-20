import { Module, Global } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from "./schemas/user.schema";
import { CustomerSchema } from "./schemas/customer.schema";
import { CustomerRepository } from "./persistence/customers.repository";
import { UsersRepository } from "./persistence/users.repository";

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'CustomerModel', schema: CustomerSchema },
            { name: 'UserModel', schema: UserSchema }
        ])
    ],
    providers: [
        CustomerRepository,
        UsersRepository
    ],
    exports: [CustomerRepository, UsersRepository]
})
export class InfrastructureModule { }