import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
        table.increments('id');
        table.integer('role_id').unsigned().references('id').inTable('roles');
        table.boolean('owner').notNullable().defaultTo(false);
        table.boolean('active').notNullable().defaultTo(false);
        table.string('email', 255).notNullable().unique();
        table.string('first_name', 50).nullable();
        table.string('last_name', 50).nullable();
        table.string('password', 100).nullable();
        table.timestamps();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('users');
}
