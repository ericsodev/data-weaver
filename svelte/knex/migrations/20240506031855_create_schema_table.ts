import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('schema', (t) => {
    t.increments('schema_id');
    t.specificType('schema_name', 'varchar(64)').unique();
    t.integer('creator_id').references('userId').inTable('user').onDelete('SET NULL');
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
