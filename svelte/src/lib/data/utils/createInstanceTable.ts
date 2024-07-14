import dayjs from 'dayjs';
import knex from '../knex';
import type { Knex } from 'knex';
import type { AttributeDTO } from '../models/attributeModel';
import type { SchemaDTO } from '../models/schemaModel';

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

export async function linkInstance(instanceID: string): Promise<void> {}

function createColumn(table: TableBuilder, attribute: AttributeDTO) {
  switch (attribute.type) {
    case 'string':
      table.string(attribute.name).notNullable();
      break;
    case 'boolean':
      table.string(attribute.name).notNullable();
      break;
    case 'number':
      table.integer(attribute.name).notNullable();
      break;
  }
  if (attribute.required) {
    table.setNullable(attribute.name);
  }
}

type InstanceTableDTO<T extends AttributeDTO[]> = {
  [name in T[number]['name']]: T[number]['type'] extends 'string'
    ? string
    : T[number]['type'] extends 'number'
      ? number
      : boolean;
};
