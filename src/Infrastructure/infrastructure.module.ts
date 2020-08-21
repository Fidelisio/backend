import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerRepository } from 'Infrastructure/persistence/customers.repository';
import { UsersRepository } from 'Infrastructure/persistence/users.repository';
import { CustomerSchema } from 'Infrastructure/schemas/customer.schema';
import { UserSchema } from 'Infrastructure/schemas/user.schema';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'CustomerModel', schema: CustomerSchema },
            { name: 'UserModel', schema: UserSchema },
        ]),
    ],
    providers: [CustomerRepository, UsersRepository],
    exports: [CustomerRepository, UsersRepository],
})
export class InfrastructureModule {}
