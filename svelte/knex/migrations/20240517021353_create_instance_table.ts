import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("instance", t => {
        t.uuid("id").primary();
        t.datetime("created_at").notNullable();
        t.datetime("updated_at").notNullable();
        t.datetime("deleted_at");
        t.string("name").unique().notNullable();
        t.foreign("creator_id").references("user.id").deferrable("deferred").notNullable();
        t.foreign("schema_id").references("schema.id").deferrable("deferred").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("instance");
}
