import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('instance', (t) => {
    t.uuid('id').primary();
    t.datetime('created_at').notNullable();
    t.datetime('updated_at').notNullable();
    t.datetime('deleted_at');
    t.string('name').unique().notNullable();
    t.string('instance_table_name').unique();

    t.uuid('creator_id').notNullable();
    t.uuid('schema_id').notNullable();

    t.foreign('creator_id').references('user.id').deferrable('deferred');
    t.foreign('schema_id').references('schema.id').deferrable('deferred');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('instance');
}
