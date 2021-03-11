import Knex from 'knex';
import {Model} from 'objection';
import knexConfig from '../../knexfile';
import Role from '../../../models/Role';
import {mysqlDate} from '../../../utilities/date';
import Permission from '../../../models/Permission';

const knex = Knex(knexConfig);
Model.knex(knex);

const createResourcePermissions = (group: string, date: string) => {
    return [
        {
            group,
            action: 'show',
            title: `View ${group}s`,
            order: 1,
            created_at: date,
            updated_at: date,
        },
        {
            group,
            action: 'store',
            title: `Create ${group}s`,
            order: 2,
            created_at: date,
            updated_at: date,
        },
        {
            group,
            action: 'update',
            title: `Update ${group}s`,
            order: 3,
            created_at: date,
            updated_at: date,
        },
        {
            group,
            action: 'destroy',
            title: `Delete ${group}s`,
            order: 4,
            created_at: date,
            updated_at: date,
        },
    ];
};

export async function seed(): Promise<void> {
    const date = mysqlDate(new Date());

    const adminRole = await Role.query().findOne({name: 'Admin'});
    const userRole = await Role.query().findOne({name: 'User'});
    const userPermissions = await Permission.query().insertGraphAndFetch(createResourcePermissions('user', date));
    const rolePermissions = await Permission.query().insertGraphAndFetch(createResourcePermissions('role', date));

    for (const permission of [...userPermissions, ...rolePermissions]) {
        if (permission.action === 'view') {
            await permission.$relatedQuery('roles').relate(userRole);
        }
        await permission.$relatedQuery('roles').relate(adminRole);
    }
}
