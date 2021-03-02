import Base from './Base';
import {Pojo} from 'objection';
import User from './User';
import Permission from './Permission';

class Role extends Base {
    id!: number;
    name!: string;
    slug!: string;

    user!: User;
    permissions!: Permission[];

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
            permissions: {
                relation: Base.ManyToManyRelation,
                modelClass: Permission,
                join: {
                    from: 'roles.id',
                    through: {
                        from: 'permission_role.role_id',
                        to: 'permission_role.permission_id',
                    },
                    to: 'permissions.id',
                },
            },
        };
    }
}

export default Role;
