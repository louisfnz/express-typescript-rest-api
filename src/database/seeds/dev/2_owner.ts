import * as bcrypt from 'bcrypt';
import Knex from 'knex';
import {Model} from 'objection';
import knexConfig from '../../knexfile';
import User from '../../../models/User';

const knex = Knex(knexConfig);
Model.knex(knex);

export async function seed(): Promise<void> {
    const hash = await bcrypt.hash(process.env.OWNER_USER_PASSWORD, 12);

    await User.query().insert({
        first_name: process.env.OWNER_USER_FIRST_NAME,
        last_name: process.env.OWNER_USER_LAST_NAME,
        email: process.env.OWNER_USER_EMAIL,
        owner: true,
        active: true,
        password: hash,
    });
}
