import 'reflect-metadata';
import {DataSource} from 'typeorm';
import {Appointment} from './entity/Appointment';
import {User} from './entity/User';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User, Appointment],
    migrations: [],
    subscribers: [],
});