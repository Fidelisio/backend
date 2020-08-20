import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { CustomerRepository } from "./Infrastructure/persistence/customers.repository";
import { InfrastructureModule } from "./Infrastructure/infrastructure.module";
import { INestApplicationContext } from "@nestjs/common";
import { CustomerStatus, Customer } from "./CRM/Domain/customer.model";
import { UsersRepository } from "./Infrastructure/persistence/users.repository";
import { User, UserStatus } from "./CRM/Domain/user.model";
import { AuthModule } from "./Auth/auth.module";
import { AuthService } from "./Auth/auth.service";

/* eslint-disable no-console */
async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    await init(app);

    await app.close();
}

async function init(app: INestApplicationContext) {
    const infraModule: INestApplicationContext = app.select(InfrastructureModule);
    const authModule: INestApplicationContext = app.select(AuthModule);

    const authService: AuthService = authModule.get(AuthService);

    const customerRepo: CustomerRepository = infraModule.get(CustomerRepository);
    const usersRepo: UsersRepository = infraModule.get(UsersRepository);

    // check if we have at least 1 customer
    // if yes, we consider the database as already initialized and we stop here
    const find = await customerRepo.findFirst();
    if (find) {
        console.error('Database already initialized');
        console.log({ find });
        // return;
    }

    const customer = await customerRepo.insertOne({
        name: 'Admin Customer',
        status: CustomerStatus.ACTIVE,
        isAdmin: true,
    } as Customer);

    console.log('customer inserted');

    await usersRepo.insertOne({
        username: 'admin',
        password: authService.generatePassword('password'),
        status: UserStatus.ACTIVE,
        customer: customer,
    } as User);

}

bootstrap();