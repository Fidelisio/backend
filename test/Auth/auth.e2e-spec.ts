import { INestApplication, ModuleMetadata } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { getTestingModuleMetadata, initTestData } from '../tools';
import { Customer } from '../../src/CRM/Domain/customer.model';
import { User } from '../../src/CRM/Domain/user.model';



describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let testCustomer: Customer;
    let testUser: User;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule(getTestingModuleMetadata()).compile();

        app = moduleFixture.createNestApplication();

        await app.init();

        const data = await initTestData(app);
        testCustomer = data.customer;
        testUser = data.user;
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('/public/auth')
            .expect(200)
            .expect('hello');
    });

    describe('/public/auth/login (POST)', () => {
        it('should return a valid token', () => {
            return request(app.getHttpServer())
                .post('/public/auth/login')
                .send({
                    username: 'user@test.com',
                    password: 'password'
                })
                .expect(200);
        });

        it('should fail with a wrong password', () => {
            return request(app.getHttpServer())
                .post('/public/auth/login')
                .send({
                    username: 'user@test.com',
                    password: 'bad>password'
                })
                .expect(400);
        });

        it('should fail with a non-existing user', () => {
            return request(app.getHttpServer())
                .post('/public/auth/login')
                .send({
                    username: 'user2@test2.com',
                    password: 'password'
                })
                .expect(400);
        });

        // @TODO : disabledCustomer , disabledUser
    })

    afterAll(async () => {
        await app.close();
    });
});
