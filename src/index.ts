import appRoot from 'app-root-path';
import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import {Model} from 'objection';
import Knex from 'knex';
import knexConfig from './database/knexfile';
import errorMiddleware from './middleware/error';
import router from './router';
import {customValidationRules} from './utilities/validate';
import notFoundMiddleware from './middleware/notFound';
import rateLimit from 'express-rate-limit';

dotenv.config({path: appRoot + '/.env'});

const app = express();
const limiter = rateLimit({
    // 100 per minute
    windowMs: 60 * 1000,
    max: 100,
});
const knex = Knex(knexConfig);

app.disable('x-powered-by');
app.set('port', process.env.PORT || 8080);
app.use(express.urlencoded({extended: false}));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(limiter);

Model.knex(knex);
customValidationRules(knex);

app.use(router);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
    console.log(`API running on ${app.get('port')}`);
});
