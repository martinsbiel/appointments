import request from 'supertest';
import app from '../src/app';
import {TestDataSource} from '../src/data-source';
import {User} from '../src/entity/User';

beforeAll(async (): Promise<void> => {
    await TestDataSource.initialize();
});

it('should let the user login', async (): Promise<void> => {
    const user: User = await User.mockTestUser(1);

    request(app).post('/api/login').send({
        email: user.email,
        password: 'secret'
    }).expect(200);
});

afterAll(async (): Promise<void> => {
    await TestDataSource.destroy();
});