import { Module, Global } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from "Infrastructure/schemas/user.schema";
import { CustomerSchema } from "Infrastructure/schemas/customer.schema";
import { CustomerRepository } from "Infrastructure/persistence/customers.repository";
import { UsersRepository } from "Infrastructure/persistence/users.repository";

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