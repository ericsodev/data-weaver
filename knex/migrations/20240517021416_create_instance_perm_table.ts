import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('instance_permission', (t) => {
    t.uuid('id').primary();
    t.datetime('created_at').notNullable();
    t.datetime('updated_at').notNullable();
    t.datetime('deleted_at');

    t.uuid('instance_id').notNullable();
    t.uuid('user_id').notNullable();

    t.foreign('instance_id')
      .references('instance.id')
      .deferrable('deferred')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    t.foreign('user_id')
      .references('user.id')
      .deferrable('deferred')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    t.string('role').notNullable();

    t.unique(['instance_id', 'user_id'], { predicate: knex.whereNull('deleted_at') });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('instance_permission');
}
