import 'reflect-metadata';
import {DataSource, EntityTarget, Repository} from 'typeorm';
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

export const TestDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    logging: false,
    entities: [User, Appointment],
});

const handleGetRepository = <T>(entity: EntityTarget<T>): Repository<T> => {
    const environment = process.env.NODE_ENV || 'development';
    return environment === 'test'
        ? TestDataSource.manager.getRepository(entity)
        : AppDataSource.manager.getRepository(entity);
};

export default handleGetRepository;