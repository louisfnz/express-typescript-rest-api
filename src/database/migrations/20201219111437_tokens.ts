import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('tokens', (table) => {
        table.increments('id');
        table.integer('user_id').unsigned().references('id').inTable('users');
        table.string('token', 255).notNullable().unique().index();
        table.string('type', 80).notNullable();
        table.boolean('is_revoked').defaultTo(false);
        table.dateTime('expires_at').nullable();
        table.timestamps();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('tokens');
}

