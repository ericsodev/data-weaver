import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('attribute', (t) => {
    t.uuid('id').primary();
    t.datetime('created_at').notNullable();
    t.datetime('updated_at').notNullable();
    t.datetime('deleted_at');

    t.uuid('schema_id').notNullable();

    t.foreign('schema_id')
      .references('schema.id')
      .deferrable('deferred')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    t.string('name').notNullable();
    t.string('type').notNullable();
    t.boolean('required').notNullable();

    t.unique(['schema_id', 'name'], {
      deferrable: 'deferred',
      predicate: knex.whereNull('deleted_at')
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('attribute');
}
