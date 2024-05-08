import { Knex } from 'knex';
import type { Schema } from '../../src/lib/models/schemaModel';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('schema').del();

  // Insert into the schema table
  const res = await knex<Schema>('schema').insert(
    [{ schema_name: 'initial_schema' }],
    ['schema_id']
  );

  await knex.schema.dropTable('schema_initial_schema');

  // Create a new data table for this schema
  await knex.schema.createTable('schema_initial_schema', (t) => {
    t.increments(); // Instance ID for this schema
    t.timestamps(true, true);
    t.integer('schema_id')
      .notNullable()
      .unique()
      .references('schema_id')
      .inTable('schema')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    t.specificType('instance_name', 'varchar(64)').notNullable().unique();

    // The remaining columns are attributes for the user created schema
    t.string('attr_heading').notNullable();
    t.string('attr_body').notNullable();
    t.string('attr_footer').notNullable();
  });
}
