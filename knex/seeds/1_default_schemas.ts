import type { Knex } from 'knex';
import type { SchemaDTO } from '../../src/lib/data/models/schemaModel';
import { convertCamelToSnakeKeys } from '../../src/lib/utils/camelToSnake';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('schema').del();

  // Inserts seed entries
  await knex<SchemaDTO>('schema').insert(
    convertCamelToSnakeKeys({
      id: '3a85de38-7fb1-4763-80de-0adf8786f607',
      name: 'introduction',
      creatorId: '27f48988-1995-48a5-8e5e-90acc0f369e1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  );
}
