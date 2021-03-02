import Knex from 'knex';
import {Model} from 'objection';
import knexConfig from '../../knexfile';
import Role from '../../../models/Role';
import {mysqlDate} from '../../../utilities/date';
import Permission from '../../../models/Permission';

const knex = Knex(knexConfig);
Model.knex(knex);

export async function seed(): Promise<void> {
    const date = mysqlDate(new Date());

    const userRole = await Role.query().findOne({slug: 'user'});
    const adminRole = await Role.query().findOne({slug: 'admin'});
    const userPermissions = await Permission.query().insertGraphAndFetch([
        {
            group: 'users',
            action: 'show',
            title: 'View users',
            order: 1,
            created_at: date,
            updated_at: date,
        },
        {
            group: 'users',
            action: 'store',
            title: 'Create users',
            order: 2,
            created_at: date,
            updated_at: date,
        },
        {
            group: 'users',
            action: 'update',
            title: 'Update users',
            order: 3,
            created_at: date,
            updated_at: date,
        },
        {
            group: 'users',
            action: 'destroy',
            title: 'Delete users',
            order: 4,
            created_at: date,
            updated_at: date,
        },
    ]);

    for (const permission of userPermissions) {
        if (permission.action === 'view') {
            await permission.$relatedQuery('roles').relate(userRole);
        }
        await permission.$relatedQuery('roles').relate(adminRole);
    }
}
