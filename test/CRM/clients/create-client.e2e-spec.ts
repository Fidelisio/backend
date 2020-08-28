import { INestApplication } from '@nestjs/common';
import { NewClientDTO } from 'CRM/dtos/clients';
import { CustomerStatus, ICustomer, IUser, UserStatus } from 'CRM/models';
import * as faker from 'faker';
import { initTestApplication, initTestData } from 'Helpers/tests.helper';
import * as request from 'supertest';

describe('Registration (e2e)', () => {
    let app: INestApplication;
    let customer: ICustomer;
    let user: IUser;
    let accessToken: string;

    beforeAll(async () => {
        faker.setLocale('fr');
        app = await initTestApplication();

        await app.init();

        const { customers, users } = await initTestData(app);

        customer = customers.find((current: ICustomer) => current.status === CustomerStatus.ACTIVE);
        user = users.find((current: IUser) => current.status === UserStatus.ACTIVE);

        const { status, body } = await request(app.getHttpServer())
            .post('/public/auth/login')
            .send({ username: user.username, password: '1P@ssword!' });

        expect(status).toBe(200);
        expect(body.accessToken).toBeDefined();

        accessToken = body.accessToken;
    });

    describe('/clients (POST)', () => {
        it('should not be publicly available', () => {
            return request(app.getHttpServer()).post('/clients').expect(401);
        });

        it('should successfully insert a valid client', () => {
            const lastName = faker.name.lastName();
            const firstName = faker.name.firstName();
            const validData = {
                name: 'Family ' + lastName,
                address: {
                    name: 'House ' + lastName,
                    streetAddress: faker.address.streetAddress(false),
                    city: faker.address.city(),
                    zipCode: faker.address.zipCode(),
                    country: faker.address.country(),
                    note: faker.lorem.words(10),
                },
                contact: {
                    firstName,
                    lastName,
                    title: faker.name.title(),
                    mobilePhone: faker.phone.phoneNumber(),
                    otherPhone: faker.phone.phoneNumber(),
                    email: faker.internet.email(firstName, lastName),
                    note: faker.lorem.words(10),
                },
            } as NewClientDTO;

            return request(app.getHttpServer())
                .post('/clients')
                .send(validData)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(({ status, body }) => {
                    expect(status).toBe(201);
                    // core attributes
                    expect(body.name).toBe(validData.name);
                    expect(body.customer._id + '').toEqual(customer._id + '');
                    expect(body.status).toBe('ACTIVE');
                    // address attributes
                    expect(body.addresses[0].isMain).toBe(true);
                    Object.keys(validData.address).forEach((key) =>
                        expect(body.addresses[0][key]).toBe(validData.address[key]),
                    );
                    // contacts attributes
                    expect(body.contacts[0].isMain).toBe(true);
                    Object.keys(validData.contact).forEach((key) => {
                        expect(body.contacts[0][key]).toBe(validData.contact[key]);
                    });
                });
        });

        it('should successfully insert a client with minimum data', () => {
            const lastName = faker.name.lastName();
            const firstName = faker.name.firstName();
            const validData = {
                name: 'Family ' + lastName,
                contact: {
                    firstName,
                    lastName,
                    title: faker.name.title(),
                },
            } as NewClientDTO;

            return request(app.getHttpServer())
                .post('/clients')
                .send(validData)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(201);
        });

        it('should successfully insert a valid client with no address', () => {
            const lastName = faker.name.lastName();
            const firstName = faker.name.firstName();
            const clientData = {
                name: 'Family ' + lastName,
                contact: {
                    firstName,
                    lastName,
                    title: faker.name.title(),
                    mobilePhone: faker.phone.phoneNumber(),
                    otherPhone: faker.phone.phoneNumber(),
                    email: faker.internet.email(firstName, lastName),
                    note: faker.lorem.words(10),
                },
            } as NewClientDTO;

            return request(app.getHttpServer())
                .post('/clients')
                .send(clientData)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(201);
        });

        it('should successfully insert a valid client with no address', () => {
            const lastName = faker.name.lastName();
            const firstName = faker.name.firstName();
            const clientData = {
                name: 'Family ' + lastName,
                contact: {
                    firstName,
                    lastName,
                    title: faker.name.title(),
                    mobilePhone: faker.phone.phoneNumber(),
                    otherPhone: faker.phone.phoneNumber(),
                    email: faker.internet.email(firstName, lastName),
                    note: faker.lorem.words(10),
                },
            } as NewClientDTO;

            return request(app.getHttpServer())
                .post('/clients')
                .send(clientData)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(201);
        });

        it('should fail to insert a client with no contact', () => {
            const clientData = {
                name: 'Family ' + faker.name.lastName(),
            } as NewClientDTO;

            return request(app.getHttpServer())
                .post('/clients')
                .send(clientData)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(({ status, body }) => {
                    expect(body.message).toBeDefined();
                    expect(body.message).toContain('contact.required');
                    expect(status).toBe(400);
                });
        });

        it('should fail to insert a client with empty contact', () => {
            const clientData = {
                name: 'Family ' + faker.name.lastName(),
                contact: {},
            } as NewClientDTO;

            return request(app.getHttpServer())
                .post('/clients')
                .send(clientData)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(400);
        });

        it('should fail to insert a client with invalid contact', () => {
            const clientData = {
                name: 'Family ' + faker.name.lastName(),
                contact: {
                    mobilePhone: faker.phone.phoneNumber(),
                    otherPhone: faker.phone.phoneNumber(),
                    email: faker.internet.email(),
                    note: faker.lorem.words(10),
                },
            } as NewClientDTO;

            return request(app.getHttpServer())
                .post('/clients')
                .send(clientData)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(400);
        });
    });

    afterAll(async () => await app.close());
});
