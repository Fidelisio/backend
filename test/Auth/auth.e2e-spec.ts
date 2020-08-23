import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomerStatus } from 'CRM/models/customer.model';
import { User, UserStatus } from 'CRM/models/user.model';
import * as request from 'supertest';

import { getTestingModuleMetadata, initTestData } from '../tools';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let testUsers: {
        active: User;
        disabled: User;
        deleted: User;
        disabledCustomer: User;
        deletedCustomer: User;
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule(
            getTestingModuleMetadata(),
        ).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
                whitelist: true,
            }),
        );

        await app.init();

        const { customers, users } = await initTestData(app);
        const deletedCustomer = customers.find(
            (customer) => customer.status === CustomerStatus.DELETED,
        );
        const disabledCustomer = customers.find(
            (customer) => customer.status === CustomerStatus.DISABLED,
        );

        testUsers = {
            active: users.find((user: User) => user.status === UserStatus.ACTIVE),
            disabled: users.find((user: User) => user.status === UserStatus.DISABLED),
            deleted: users.find((user: User) => user.status === UserStatus.DELETED),
            disabledCustomer: users.find((user: User) =>
                user.customer._id.equals(disabledCustomer.id),
            ),
            deletedCustomer: users.find((user: User) =>
                user.customer._id.equals(deletedCustomer.id),
            ),
        };
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer()).get('/public/auth').expect(200).expect('hello');
    });

    describe('/public/auth/login (POST)', () => {
        it('should return a valid token', () => {
            return request(app.getHttpServer())
                .post('/public/auth/login')
                .send({
                    username: testUsers.active.username,
                    password: 'password',
                })
                .expect(200);
        });

        describe('should fail due to', () => {
            it('missing username', () => {
                return request(app.getHttpServer())
                    .post('/public/auth/login')
                    .send({ password: 'bad>password' })
                    .expect(400);
            });

            it('missing password', () => {
                return request(app.getHttpServer())
                    .post('/public/auth/login')
                    .send({ username: testUsers.active.username })
                    .expect(400);
            });

            it('wrong password', () => {
                return request(app.getHttpServer())
                    .post('/public/auth/login')
                    .send({
                        username: testUsers.active.username,
                        password: 'bad>password',
                    })
                    .expect(400);
            });

            it('non-existing user', () => {
                return request(app.getHttpServer())
                    .post('/public/auth/login')
                    .send({
                        username: 'user2@donotexists.com',
                        password: 'password',
                    })
                    .expect(400);
            });

            it('disabled user', () => {
                return request(app.getHttpServer())
                    .post('/public/auth/login')
                    .send({
                        username: testUsers.disabled.username,
                        password: 'password',
                    })
                    .expect(400);
            });

            it('deleted user', () => {
                return request(app.getHttpServer())
                    .post('/public/auth/login')
                    .send({
                        username: testUsers.deleted.username,
                        password: 'password',
                    })
                    .expect(400);
            });

            it('disabled customer', () => {
                return request(app.getHttpServer())
                    .post('/public/auth/login')
                    .send({
                        username: testUsers.disabledCustomer.username,
                        password: 'password',
                    })
                    .expect(400);
            });

            it('deleted customer', () => {
                return request(app.getHttpServer())
                    .post('/public/auth/login')
                    .send({
                        username: testUsers.deletedCustomer.username,
                        password: 'password',
                    })
                    .expect(400);
            });
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
