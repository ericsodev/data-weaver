import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("user", t => {
        t.uuid("id").primary();
        t.datetime("created_at").notNullable();
        t.datetime("updated_at").notNullable();
        t.datetime("deleted_at");
        t.string("username").unique().notNullable();
        t.string("password_hash").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("user");
}
