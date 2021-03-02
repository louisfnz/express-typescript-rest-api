import Base from './Base';
import {Pojo} from 'objection';
import Role from './Role';

class Permission extends Base {
    id!: number;
    group!: string;
    action!: string;
    title!: string;
    order!: number;

    roles!: Role[];

    static get tableName(): string {
        return 'permissions';
    }

    static relationMappings(): Pojo {
        return {
            roles: {
                relation: Base.ManyToManyRelation,
                modelClass: Role,
                join: {
                    from: 'permissions.id',
                    through: {
                        from: 'permission_role.permission_id',
                        to: 'permission_role.role_id',
                    },
                    to: 'roles.id',
                },
            },
        };
    }
}

export default Permission;
