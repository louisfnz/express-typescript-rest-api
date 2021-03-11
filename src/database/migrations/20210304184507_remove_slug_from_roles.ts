import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('roles', (table) => {
        table.dropColumn('slug');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('roles', (table) => {
        table.string('slug', 255).notNullable().unique();
    });
}
