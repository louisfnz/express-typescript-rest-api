import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('user_logins', (table) => {
        table.increments('id');
        table.integer('user_id').unsigned().references('id').inTable('users');
        table
            .string('token', 1000)
            .notNullable();
        table
            .string('user_agent', 512)
            .notNullable();
        table
            .string('ip_address', 100)
            .notNullable();
        table
            .boolean('valid')
            .notNullable()
            .defaultTo(false);
        table.timestamps();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('user_logins');
}

