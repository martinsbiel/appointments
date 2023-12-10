import request, {Request} from 'supertest';
import app from '../src/app';
import {TestDataSource} from '../src/data-source';
import {User} from '../src/entity/User';

beforeAll(async (): Promise<void> => {
    await TestDataSource.initialize();
});

it('should create an user', (): void => {
    request(app).post('/api/user').send({
        name: 'Jane Doe',
        email: 'jane@email.com',
        password: 'secret'
    }).expect(201);
});

it('should return the user by id', async (): Promise<void> => {
    const user: User = await User.mockTestUser(2);

    const response: Request = request(app).post('/api/login').send({
        email: user.email,
        password: user.password
    }).expect(200);
    
    request(app).get(`/api/user/${user.id}`).set('Authorization', `Bearer ${response}`).expect(200);
});

it('should return all users', async (): Promise<void> => {
    const user: User = await User.mockTestUser(1);

    const response: Request = request(app).post('/api/login').send({
        email: user.email,
        password: user.password
    }).expect(200);

    request(app).get('/api/user').set('Authorization', `Bearer ${response}`).expect(200);
});

it('should let the user be updated', async (): Promise<void> => {
    const user: User = await User.mockTestUser(2);

    const response: Request = request(app).post('/api/login').send({
        email: user.email,
        password: user.password
    }).expect(200);

    request(app).patch(`/api/user/${user.id}`).set('Authorization', `Bearer ${response}`).send({
        name: 'John',
        email: 'johndoe@email.com',
        password: 'secret123'
    }).expect(200);
});

it('should delete the user', async (): Promise<void> => {
    const user: User = await User.mockTestUser(2);

    const response: Request = request(app).post('/api/login').send({
        email: user.email,
        password: user.password
    }).expect(200);

    request(app).delete(`/api/user/${user.id}`).set('Authorization', `Bearer ${response}`).expect(200);
});

afterAll(async (): Promise<void> => {
    await TestDataSource.destroy();
});