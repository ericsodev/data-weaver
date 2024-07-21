import type { Knex } from 'knex';
import type { SchemaPermissionDTO } from '../../src/lib/data/models/schemaPermissionModel';
import { randomUUID } from 'crypto';
import { convertCamelToSnakeKeys } from '../../src/lib/utils/camelToSnake';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('schema_permission').del();

  // Inserts seed entries
  await knex<SchemaPermissionDTO>('schema_permission').insert(
    convertCamelToSnakeKeys({
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: '27f48988-1995-48a5-8e5e-90acc0f369e1',
      schemaId: '3a85de38-7fb1-4763-80de-0adf8786f607',
      accessType: 'ADMIN'
    })
  );
}
