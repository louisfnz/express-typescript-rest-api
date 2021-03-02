import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('permission_role', (table) => {
        table.increments('id');
        table.integer('permission_id').unsigned().references('id').inTable('permissions');
        table.integer('role_id').unsigned().references('id').inTable('roles');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('permission_role');
}
