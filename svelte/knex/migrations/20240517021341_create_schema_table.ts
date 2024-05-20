import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('schema', (t) => {
    t.uuid('id').primary();
    t.string('name').unique().notNullable();
    t.datetime('created_at').notNullable();
    t.datetime('updated_at').notNullable();
    t.datetime('deleted_at');
    t.uuid('creator_id').notNullable();
    t.foreign('creator_id').references('user.id').deferrable('deferred');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('schema');
}
