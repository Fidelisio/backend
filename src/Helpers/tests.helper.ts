import { INestApplication, INestApplicationContext, ModuleMetadata } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from 'Auth/auth.module';
import { AuthService } from 'Auth/auth.service';
import { CrmModule } from 'CRM/crm.module';
import { CustomerStatus, ICustomer } from 'CRM/models/customer.model';
import { IUser, UserStatus } from 'CRM/models/user.model';
import { ICustomerRepository } from 'CRM/repositories/customers.repository';
import { IUsersRepository } from 'CRM/repositories/users.repository';
import { init } from 'Helpers/init.helper';
import { InfrastructureModule } from 'Infrastructure/infrastructure.module';

async function findOrCreateTestCustomers(
    customerRepository: ICustomerRepository,
): Promise<ICustomer[]> {
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
            } as ICustomer);
        }

        customers.push(customer);
    }

    return customers;
}

async function findOrCreateTestUsers(
    testCustomers: ICustomer[],
    userRepository: IUsersRepository,
    authService: AuthService,
): Promise<IUser[]> {
    const passwordHash = authService.generatePassword('password');

    const customers = {
        active: testCustomers.find((current) => current.status === CustomerStatus.ACTIVE),
        disabled: testCustomers.find((current) => current.status === CustomerStatus.DISABLED),
        deleted: testCustomers.find((current) => current.status === CustomerStatus.DELETED),
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
            } as IUser);
        }

        users.push(user);
    }

    return users;
}

export async function initTestData(
    app: INestApplication,
): Promise<{ customers: ICustomer[]; users: IUser[] }> {
    const infraModule: INestApplicationContext = app.select<InfrastructureModule>(
        InfrastructureModule,
    );

    const customers = await findOrCreateTestCustomers(infraModule.get(ICustomerRepository));
    const users = await findOrCreateTestUsers(
        customers,
        infraModule.get(IUsersRepository),
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

export async function initTestApplication(): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule(
        getTestingModuleMetadata(),
    ).compile();

    return init(moduleFixture.createNestApplication());
}
