import { ModuleMetadata, INestApplication, INestApplicationContext } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { InfrastructureModule } from "../src/Infrastructure/infrastructure.module";
import { AuthModule } from "../src/Auth/auth.module";
import { CrmModule } from "../src/CRM/crm.module";
import { Customer, CustomerStatus } from "../src/CRM/Domain/customer.model";
import { User, UserStatus } from "../src/CRM/Domain/user.model";
import { CustomerRepository } from "../src/Infrastructure/persistence/customers.repository";
import { UsersRepository } from "../src/Infrastructure/persistence/users.repository";
import { AuthService } from "../src/Auth/auth.service";

async function findOrCreateTestCustomer(customerRepository: CustomerRepository): Promise<Customer> {
    let customer = await customerRepository.findByName('test.customer');
    if (!customer) {
        customer = await customerRepository.insertOne({
            name: 'test.customer',
            status: CustomerStatus.ACTIVE,
            isAdmin: false
        } as Customer)
    }

    return customer;
}

async function findOrCreateTestUser(customer: Customer, userRepository: UsersRepository, authService: AuthService): Promise<User> {
    let user = await userRepository.findByUsername('user@test.com');
    if (!user) {
        user = await userRepository.insertOne({
            username: 'user@test.com',
            password: authService.generatePassword('password'),
            status: UserStatus.ACTIVE,
            customer
        } as User);
    }

    return user;
}

export async function initTestData(app: INestApplication): Promise<{ customer: Customer, user: User }> {
    const infraModule: INestApplicationContext = app.select<InfrastructureModule>(InfrastructureModule);

    const customer = await findOrCreateTestCustomer(infraModule.get(CustomerRepository));
    const user = await findOrCreateTestUser(customer, infraModule.get(UsersRepository), app.select(AuthModule).get(AuthService));

    return { customer, user };
}

export function getTestingModuleMetadata(): ModuleMetadata {
    return {
        imports: [
            ConfigModule.forRoot({
                isGlobal: true,
            }),
            MongooseModule.forRootAsync({
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => ({
                    uri: configService.get<string>('MONGODB_URI'),
                    useNewUrlParser: true,
                    useCreateIndex: true,
                    useUnifiedTopology: true,
                    useFindAndModify: true,
                }),
                inject: [ConfigService],
            }),
            // business modules
            InfrastructureModule,
            AuthModule,
            CrmModule,
        ],
    };
}