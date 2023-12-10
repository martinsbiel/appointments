import request, { Request } from 'supertest';
import app from '../src/app';
import {TestDataSource} from '../src/data-source';
import {User} from '../src/entity/User';
import {Appointment} from '../src/entity/Appointment';

beforeAll(async (): Promise<void> => {
    await TestDataSource.initialize();
});

it('should let the user create an appointment', async (): Promise<void> => {
    const user: User = await User.mockTestUser(2);

    const response: Request = request(app).post('/api/login').send({
        email: user.email,
        password: user.password
    }).expect(200);

    request(app).post('/api/appointment').set('Authorization', `Bearer ${response}`).send({
        title: 'Appointment 1',
        content: 'Content of first appointment!',
        target_date: '2023-11-11 08:08:08',
        user: 1
    }).expect(201);
});

it('should let the user view their appointment', async (): Promise<void> => {
    const user: User = await User.mockTestUser(2);

    const response: Request = request(app).post('/api/login').send({
        email: user.email,
        password: user.password
    }).expect(200);

    const appointment: Appointment = await Appointment.mockTestAppointment(user);

    request(app).get(`/api/appointment/${appointment.id}`).set('Authorization', `Bearer ${response}`).expect(200);
});

it('should let the user view all their appointments', async (): Promise<void> => {
    const user: User = await User.mockTestUser(2);

    const response: Request = request(app).post('/api/login').send({
        email: user.email,
        password: user.password
    }).expect(200);

    const appointment: Appointment = await Appointment.mockTestAppointment(user);

    request(app).get('/api/appointment').set('Authorization', `Bearer ${response}`).expect(200);
});

it('should let the user update their appointment', async (): Promise<void> => {
    const user: User = await User.mockTestUser(2);

    const response: Request = request(app).post('/api/login').send({
        email: user.email,
        password: user.password
    }).expect(200);

    const appointment: Appointment = await Appointment.mockTestAppointment(user);

    request(app).patch(`/api/appointment/${appointment.id}`).set('Authorization', `Bearer ${response}`).send({
        title: 'Appointment 1 updated',
        content: 'Content of first updated appointment!',
        target_date: '2023-11-11 09:09:09',
    }).expect(200);
});

it('should let the user delete their appointment', async (): Promise<void> => {
    const user: User = await User.mockTestUser(2);

    const response: Request = request(app).post('/api/login').send({
        email: user.email,
        password: user.password
    }).expect(200);

    const appointment: Appointment = await Appointment.mockTestAppointment(user);

    request(app).delete(`/api/appointment/${appointment.id}`).set('Authorization', `Bearer ${response}`).expect(200);
});

afterAll(async (): Promise<void> => {
    await TestDataSource.destroy();
});