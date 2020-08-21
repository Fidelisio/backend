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

async function findOrCreateTestCustomers(customerRepository: CustomerRepository): Promise<Customer[]> {
    const customersData = [
        { name: 'test.customer', status: CustomerStatus.ACTIVE },
        { name: 'test.disabled.customer', status: CustomerStatus.DISABLED },
        { name: 'test.deleted.customer', status: CustomerStatus.DELETED },
    ];

    let customers = [];
    for (let customerData of customersData) {
        let customer = await customerRepository.findByName(customerData.name);
        if (!customer) {
            customer = await customerRepository.insertOne({
                name: customerData.name,
                status: customerData.status,
                isAdmin: false
            } as Customer)
        }

        customers.push(customer);
    }

    return customers;
}

async function findOrCreateTestUsers(testCustomers: Customer[], userRepository: UsersRepository, authService: AuthService): Promise<User[]> {
    const passwordHash = authService.generatePassword('password');

    const customers = {
        active: testCustomers.find(current => current.status === CustomerStatus.ACTIVE),
        disabled: testCustomers.find(current => current.status === CustomerStatus.DISABLED),
        deleted: testCustomers.find(current => current.status === CustomerStatus.DELETED),
    }

    const usersData = [
        { username: 'user@test.com', status: UserStatus.ACTIVE, customer: customers.active },
        { username: 'user.disabled@test.com', status: UserStatus.DISABLED, customer: customers.active },
        { username: 'user.deleted@test.com', status: UserStatus.DELETED, customer: customers.active },
        { username: 'user.disabled.customer@test.com', status: UserStatus.ACTIVE, customer: customers.disabled },
        { username: 'user.deleted.customer@test.com', status: UserStatus.ACTIVE, customer: customers.deleted },
    ]

    let users = [];
    for (let userData of usersData) {
        let user = await userRepository.findByUsername(userData.username);
        if (!user) {
            user = await userRepository.insertOne({
                username: userData.username,
                password: passwordHash,
                status: userData.status,
                customer: userData.customer
            } as User);
        }

        users.push(user);
    }

    return users;
}

export async function initTestData(app: INestApplication): Promise<{ customers: Customer[], users: User[] }> {
    const infraModule: INestApplicationContext = app.select<InfrastructureModule>(InfrastructureModule);

    const customers = await findOrCreateTestCustomers(infraModule.get(CustomerRepository));
    const users = await findOrCreateTestUsers(customers, infraModule.get(UsersRepository), app.select(AuthModule).get(AuthService));

    return { customers, users };
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