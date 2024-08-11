import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('role', (t) => {
    t.uuid('id').primary();
    t.datetime('created_at').notNullable();
    t.datetime('updated_at').notNullable();
    t.datetime('deleted_at');

    t.string('name').notNullable();
    t.uuid('user_id').notNullable().references('user.id');
    t.uuid('assigner_id').notNullable().references('user.id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('role');
}
