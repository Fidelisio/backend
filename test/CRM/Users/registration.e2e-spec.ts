import { INestApplication } from '@nestjs/common';
import * as faker from 'faker';
import { initTestApplication } from 'Helpers/tests.helper';
import * as request from 'supertest';

describe('Registration (e2e)', () => {
    let app: INestApplication;
    let validPasssword: string;

    beforeAll(async () => {
        app = await initTestApplication();
        validPasssword = faker.internet.password(10, false, null, '1@Pp');

        await app.init();
    });

    describe('/public/register (POST)', () => {
        it('should successfully register', () => {
            const validData = {
                username: faker.internet.email(),
                password: validPasssword,
                customerName: faker.company.companyName() + Date.now(),
            };

            return request(app.getHttpServer())
                .post('/public/register')
                .send(validData)
                .expect(({ status, body: user }) => {
                    expect(status).toBe(201);
                    expect(user.status).toBe('ACTIVE');
                    expect(user.username).toBe(validData.username);
                    expect(user.password).toBeUndefined();
                    expect(user.customer.name).toBe(validData.customerName);
                    expect(user.customer.status).toBe('ACTIVE');
                    expect(user.customer.isAdmin).toBe(false);
                });
        });

        describe('should fail due to', () => {
            it('same username twice', async () => {
                const twiceData = {
                    username: faker.internet.email(),
                    password: validPasssword,
                    customerName: faker.company.companyName() + Date.now(),
                };

                await request(app.getHttpServer())
                    .post('/public/register')
                    .send(twiceData)
                    .expect(201);

                await request(app.getHttpServer())
                    .post('/public/register')
                    .send({ ...twiceData, customerName: faker.company.companyName() + Date.now() })
                    .expect(400);
            });

            it('same customer.name twice', async () => {
                const twiceData = {
                    username: faker.internet.email(),
                    password: validPasssword,
                    customerName: faker.company.companyName() + Date.now(),
                };

                const firstInsert = await request(app.getHttpServer())
                    .post('/public/register')
                    .send(twiceData);

                expect(firstInsert.status).toBe(201);

                const secondInsert = await request(app.getHttpServer())
                    .post('/public/register')
                    .send({ ...twiceData, username: faker.internet.email() });

                expect(secondInsert.status).toBe(400);
            });

            it('missing username', () => {
                return request(app.getHttpServer())
                    .post('/public/register')
                    .send({
                        password: faker.internet.password(10, false),
                        customerName: faker.company.companyName() + Date.now(),
                    })
                    .expect(({ status, body }) => {
                        expect(status).toBe(400);
                        expect(body.message).toBeDefined();
                        expect(body.message).toContain('username.required');
                    });
            });

            it('invalid username', () => {
                return request(app.getHttpServer())
                    .post('/public/register')
                    .send({
                        username: faker.fake(`{{name.firstName}}.{{name.lastName}}`),
                        password: faker.internet.password(10, false),
                        customerName: faker.company.companyName() + Date.now(),
                    })
                    .expect(({ status, body }) => {
                        expect(body.message).toBeDefined();
                        expect(body.message).toContain('username.invalid.format');
                        expect(status).toBe(400);
                    });
            });

            it('missing password', () => {
                return request(app.getHttpServer())
                    .post('/public/register')
                    .send({
                        username: faker.internet.email(),
                        customerName: faker.company.companyName() + Date.now(),
                    })
                    .expect(({ status, body }) => {
                        expect(body.message).toBeDefined();
                        expect(body.message).toContain('password.required');
                        expect(status).toBe(400);
                    });
            });

            it('invalid password', () => {
                return request(app.getHttpServer())
                    .post('/public/register')
                    .send({
                        username: faker.internet.email(),
                        password: faker.internet.password(6),
                        customerName: faker.company.companyName() + Date.now(),
                    })
                    .expect(({ status, body }) => {
                        expect(body.message).toBeDefined();
                        expect(body.message).toContain('password.invalid.format');
                        expect(status).toBe(400);
                    });
            });

            it('missing customerName', () => {
                return request(app.getHttpServer())
                    .post('/public/register')
                    .send({ username: faker.internet.email(), password: validPasssword })
                    .expect(({ status, body }) => {
                        expect(body.message).toBeDefined();
                        expect(body.message).toContain('customerName.required');
                        expect(status).toBe(400);
                    });
            });

            it('invalid customerName', () => {
                return request(app.getHttpServer())
                    .post('/public/register')
                    .send({
                        username: faker.internet.email(),
                        password: validPasssword,
                        customerName: 'yo',
                    })
                    .expect(({ status, body }) => {
                        expect(body.message).toBeDefined();
                        expect(body.message).toContain('customerName.invalid.format');
                        expect(status).toBe(400);
                    });
            });
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
