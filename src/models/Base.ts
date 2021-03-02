import {Model, Pojo} from 'objection';
import {omit} from 'lodash';
import {mysqlDate} from '../utilities/date';

class Base extends Model {
    created_at?: string;
    updated_at?: string;

    static get modelPaths(): string[] {
        return [__dirname];
    }

    get $secureFields(): string[] {
        return [];
    }

    $formatJson(json: Pojo): Pojo {
        json = super.$formatJson(json);
        return omit(json, this.$secureFields);
    }

    $beforeInsert(): void {
        const date = mysqlDate(new Date());
        this.created_at = date;
        this.updated_at = date;
    }

    $beforeUpdate(): void {
        this.updated_at = mysqlDate(new Date());
    }
}

export default Base;
