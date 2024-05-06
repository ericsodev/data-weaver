import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user', function (t) {
    t.increments('userId');
    t.string('name').unique().notNullable();
    t.specificType('password_hash', 'char(64)').notNullable();
    t.boolean('is_admin').notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {}
