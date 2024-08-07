import dayjs from 'dayjs';
import knex from '../knex';
import type { Knex } from 'knex';
import type { AttributeDTO } from '../models/attribute.model';
import type { SchemaDTO } from '../models/schema.model';

type TableBuilder = Parameters<Parameters<Knex['schema']['createTable']>[1]>[0];

export async function createInstanceTable(schema: SchemaDTO): Promise<string> {
  const currentDay = dayjs().format('YYYY-MM-DD');
  const tableName = `${currentDay}-${crypto.randomUUID().slice(8)}`;
  const attributes = schema.attributes;

  if (!attributes || attributes.length === 0) {
    throw new Error('Cannot create instance on empty schema');
  }

  await knex.schema.createTable(tableName, (t) => {
    for (const attribute of attributes) {
      createColumn(t, attribute);
    }
  });
  return tableName;
}

function createColumn(table: TableBuilder, attribute: AttributeDTO) {
  switch (attribute.type) {
    case 'string':
      table.string(attribute.name).nullable();
      break;
    case 'boolean':
      table.string(attribute.name).nullable();
      break;
    case 'number':
      table.integer(attribute.name).nullable();
      break;
  }
}
