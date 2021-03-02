import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('permissions', (table) => {
        table.increments('id');
        table.string('group', 255).notNullable();
        table.string('action', 255).notNullable();
        table.string('title', 255).notNullable();
        table.integer('order');
        table.timestamps();
        table.unique(['group', 'action']);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('permissions');
}
