import {
    INestApplication,
    INestApplicationContext,
    ModuleMetadata,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'Auth/auth.module';
import { AuthService } from 'Auth/auth.service';
import { CrmModule } from 'CRM/crm.module';
import { Customer, CustomerStatus } from 'CRM/Domain/customer.model';
import { User, UserStatus } from 'CRM/Domain/user.model';
import { InfrastructureModule } from 'Infrastructure/infrastructure.module';
import { CustomerRepository } from 'Infrastructure/persistence/customers.repository';
import { UsersRepository } from 'Infrastructure/persistence/users.repository';

async function findOrCreateTestCustomers(
    customerRepository: CustomerRepository,
): Promise<Customer[]> {
    const customersData = [
        { name: 'test.customer', status: CustomerStatus.ACTIVE },
        { name: 'test.disabled.customer', status: CustomerStatus.DISABLED },
        { name: 'test.deleted.customer', status: CustomerStatus.DELETED },
    ];

    const customers = [];
    for (const customerData of customersData) {
        let customer = await customerRepository.findByName(customerData.name);
        if (!customer) {
            customer = await customerRepository.insertOne({
                name: customerData.name,
                status: customerData.status,
                isAdmin: false,
            } as Customer);
        }

        customers.push(customer);
    }

    return customers;
}

async function findOrCreateTestUsers(
    testCustomers: Customer[],
    userRepository: UsersRepository,
    authService: AuthService,
): Promise<User[]> {
    const passwordHash = authService.generatePassword('password');

    const customers = {
        active: testCustomers.find(
            (current) => current.status === CustomerStatus.ACTIVE,
        ),
        disabled: testCustomers.find(
            (current) => current.status === CustomerStatus.DISABLED,
        ),
        deleted: testCustomers.find(
            (current) => current.status === CustomerStatus.DELETED,
        ),
    };

    const usersData = [
        {
            username: 'user@test.com',
            status: UserStatus.ACTIVE,
            customer: customers.active,
        },
        {
            username: 'user.disabled@test.com',
            status: UserStatus.DISABLED,
            customer: customers.active,
        },
        {
            username: 'user.deleted@test.com',
            status: UserStatus.DELETED,
            customer: customers.active,
        },
        {
            username: 'user.disabled.customer@test.com',
            status: UserStatus.ACTIVE,
            customer: customers.disabled,
        },
        {
            username: 'user.deleted.customer@test.com',
            status: UserStatus.ACTIVE,
            customer: customers.deleted,
        },
    ];

    const users = [];
    for (const userData of usersData) {
        let user = await userRepository.findByUsername(userData.username);
        if (!user) {
            user = await userRepository.insertOne({
                username: userData.username,
                password: passwordHash,
                status: userData.status,
                customer: userData.customer,
            } as User);
        }

        users.push(user);
    }

    return users;
}

export async function initTestData(
    app: INestApplication,
): Promise<{ customers: Customer[]; users: User[] }> {
    const infraModule: INestApplicationContext = app.select<
        InfrastructureModule
    >(InfrastructureModule);

    const customers = await findOrCreateTestCustomers(
        infraModule.get(CustomerRepository),
    );
    const users = await findOrCreateTestUsers(
        customers,
        infraModule.get(UsersRepository),
        app.select(AuthModule).get(AuthService),
    );

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
