require('dotenv').config();
import express, {Express} from 'express';
import 'reflect-metadata';

const app: Express = express();

// JSON middleware
app.use(express.json());

// DB
import {AppDataSource} from './data-source';

// Routes
import router from './router';

// Logger
import Logger from '../config/logger';

// Middlewares
import morganMiddleware from './middleware/morganMiddleware';

app.use(morganMiddleware);
app.use('/api/', router);

// Cronjob
import job from './cron';
job.start();

AppDataSource.initialize()
    .then(() => {
        Logger.info('Data Source has been initialized!');
    })
    .catch((error) => Logger.error(error));

export default app;