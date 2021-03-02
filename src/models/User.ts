import {Pojo} from 'objection';
import Base from './Base';
import Token from './Token';
import UserLogin from './UserLogin';
import Role from './Role';
import Permission from './Permission';

class User extends Base {
    id!: number;
    role_id!: number;
    first_name?: string;
    last_name?: string;
    email!: string;
    password!: string;
    owner!: boolean;
    active!: boolean;

    tokens!: Token[];
    user_logins!: UserLogin[];
    role?: Role;
    permissions!: Permission[];

    static get tableName(): string {
        return 'users';
    }

    static relationMappings(): Pojo {
        return {
            tokens: {
                relation: Base.HasManyRelation,
                modelClass: Token,
                join: {
                    from: 'users.id',
                    to: 'tokens.user_id',
                },
            },
            user_logins: {
                relation: Base.HasManyRelation,
                modelClass: UserLogin,
                join: {
                    from: 'users.id',
                    to: 'user_logins.user_id',
                },
            },
            role: {
                relation: Base.BelongsToOneRelation,
                modelClass: Role,
                join: {
                    from: 'users.role_id',
                    to: 'roles.id',
                },
            },
            permissions: {
                relation: Base.ManyToManyRelation,
                modelClass: Permission,
                join: {
                    from: 'users.role_id',
                    through: {
                        from: 'permission_role.role_id',
                        to: 'permission_role.permission_id',
                    },
                    to: 'permissions.id',
                },
            },
        };
    }

    get $secureFields(): string[] {
        return ['password'];
    }

    static get virtualAttributes(): string[] {
        return ['full_name'];
    }

    get full_name(): string {
        return `${this.first_name} ${this.last_name}`;
    }
}

export default User;
