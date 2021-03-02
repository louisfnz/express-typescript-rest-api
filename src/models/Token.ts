import Base from './Base';
import {Pojo} from 'objection';
import User from './User';

class Token extends Base {
    id!: number;
    user_id!: number;
    token!: string;
    type!: string;
    is_revoked!: boolean;
    expires_at?: string;

    user!: User;

    static get tableName(): string {
        return 'tokens';
    }

    static relationMappings(): Pojo {
        return {
            user: {
                relation: Base.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'tokens.user_id',
                    to: 'users.id',
                },
            },
        };
    }
}

export default Token;
