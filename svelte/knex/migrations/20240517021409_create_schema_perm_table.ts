import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("schema_permission", t => {
        t.uuid("id").primary();
        t.datetime("created_at").notNullable();
        t.datetime("updated_at").notNullable();
        t.datetime("deleted_at");

        t.foreign("schema_id").references("schema.id").notNullable().deferrable("deferred");
        t.foreign("user_id").references("user.id").notNullable().deferrable("deferred");

        t.string("access_type").notNullable();

        t.unique(["schema_id", "user_id"]);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("schema_permission");
}
