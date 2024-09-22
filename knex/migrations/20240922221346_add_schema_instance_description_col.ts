import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('instance', (t) => {
    t.string('description').nullable();
  });
  await knex.schema.alterTable('schema', (t) => {
    t.string('description').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('instance', (t) => {
    t.dropColumn('description');
  });
  await knex.schema.alterTable('schema', (t) => {
    t.dropColumn('description');
  });
}
