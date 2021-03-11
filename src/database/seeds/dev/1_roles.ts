import Knex from 'knex';
import {Model} from 'objection';
import knexConfig from '../../knexfile';
import Role from '../../../models/Role';

const knex = Knex(knexConfig);
Model.knex(knex);

export async function seed(): Promise<void> {
    await Role.query().insertGraph([
        {
            name: 'Admin',
        },
        {
            name: 'User',
        },
    ]);
}
