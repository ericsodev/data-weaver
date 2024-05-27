import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('schema_permission', (t) => {
    t.uuid('id').primary();
    t.datetime('created_at').notNullable();
    t.datetime('updated_at').notNullable();
    t.datetime('deleted_at');

    t.uuid('schema_id').notNullable();
    t.uuid('user_id').notNullable();

    t.foreign('schema_id')
      .references('schema.id')
      .deferrable('deferred')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    t.foreign('user_id')
      .references('user.id')
      .deferrable('deferred')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    t.string('access_type').notNullable();

    t.unique(['schema_id', 'user_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('schema_permission');
}
