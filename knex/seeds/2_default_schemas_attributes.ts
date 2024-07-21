import type { Knex } from 'knex';
import type { AttributeDTO } from '../../src/lib/data/models/attributeModel';
import { convertCamelToSnakeKeys } from '../../src/lib/utils/camelToSnake';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('attribute').del();

  // Inserts seed entries
  await knex<AttributeDTO>('attribute').insert(
    [
      {
        id: '1c92e8bb-3ba7-4163-a950-007ee4be08b9',
        name: 'title',
        schemaId: '3a85de38-7fb1-4763-80de-0adf8786f607',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        type: 'string',
        required: true
      },
      {
        id: '2fd7b28e-1590-4db6-a245-2b24c21ec299',
        name: 'body',
        schemaId: '3a85de38-7fb1-4763-80de-0adf8786f607',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        type: 'string',
        required: false
      },
      {
        id: '273ff036-a13f-4b88-842d-6235b24617bc',
        name: 'years',
        schemaId: '3a85de38-7fb1-4763-80de-0adf8786f607',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        type: 'number',
        required: true
      },
      {
        id: '718bbc11-5520-4eeb-92a1-3c3006fedd9a',
        name: 'important',
        schemaId: '3a85de38-7fb1-4763-80de-0adf8786f607',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        type: 'boolean',
        required: true
      }
    ].map(convertCamelToSnakeKeys)
  );
}
