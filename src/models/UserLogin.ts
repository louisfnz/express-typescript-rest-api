import Base from './Base';
import {Pojo} from 'objection';
import User from './User';

class UserLogin extends Base {
    id!: number;
    user_id!: number;
    token!: string;
    user_agent!: string;
    ip_address!: string;
    valid!: boolean;

    user!: User;

    static get tableName(): string {
        return 'user_logins';
    }

    static relationMappings(): Pojo {
        return {
            user: {
                relation: Base.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'user_logins.user_id',
                    to: 'users.id',
                },
            },
        };
    }
}

export default UserLogin;
