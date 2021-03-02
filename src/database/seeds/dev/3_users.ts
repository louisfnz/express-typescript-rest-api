import Knex from 'knex';
import {Model} from 'objection';
import * as bcrypt from 'bcrypt';
import faker from 'faker';
import range from 'lodash/range';
import knexConfig from '../../knexfile';
import Role from '../../../models/Role';
import User from '../../../models/User';
import {mysqlDate} from '../../../utilities/date';

const knex = Knex(knexConfig);
Model.knex(knex);

export async function seed(): Promise<void> {
    const date = mysqlDate(new Date());

    const role = await Role.query().findOne({name: 'User'});
    const password = await bcrypt.hash('test', 12);

    await User.query().insertGraph(
        range(100).map(() => {
            const email = faker.internet.email();
            return {
                role_id: role.id,
                email,
                password,
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                owner: false,
                active: true,
                created_at: date,
                updated_at: date,
            };
        }),
    );
}
