import Base from './Base';
import {Pojo} from 'objection';
import User from './User';

class Role extends Base {
    id!: number;
    name!: string;
    slug!: string;

    user!: User;

    static get tableName(): string {
        return 'roles';
    }

    static relationMappings(): Pojo {
        return {
            users: {
                relation: Base.HasManyRelation,
                modelClass: User,
                join: {
                    from: 'roles.id',
                    to: 'users.role_id',
                },
            },
        };
    }
}

export default Role;
