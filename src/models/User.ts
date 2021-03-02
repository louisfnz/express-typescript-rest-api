import {Pojo} from 'objection';
import Base from './Base';
import Token from './Token';
import UserLogin from './UserLogin';
import Role from './Role';

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
    role!: Role;

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
