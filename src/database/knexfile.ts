import appRoot from 'app-root-path';
import * as dotenv from 'dotenv';
dotenv.config({ path: appRoot + '/.env' });

const config = {
    client: process.env.DB_CLIENT,
    connection: {
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    },
    migrations: {
        directory: process.env.DB_MIGRATIONS_PATH
    },
    seeds: {
        directory: process.env.DB_SEEDS_PATH
    }
};



export default config;
