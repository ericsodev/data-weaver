import db from '$lib/db/knex';
import type { Schema, Attribute, TableColumn, AttributeType } from '$lib/models/schemaModel';

export function convertSchemaToTableName(schema_name: string): string {
  return 'schema_' + schema_name.replaceAll(' ', '_');
}

export function extractAttributeNameFromColName(colName: string): string {
  return colName.substring(5);
}

export function parseAttribute(column: TableColumn): Attribute | undefined {
  const required = !column.is_nullable;
  const attributeType = convertColToDataType(column.data_type);
  const name = extractAttributeNameFromColName(column.column_name);

  if (attributeType === undefined) {
    console.log(`Unsupported data type ${column.data_type} for attribute ${name}`);
    return undefined;
  }

  return { name, required, type: attributeType };
}

export function convertColToDataType(columnDataType: string): AttributeType | undefined {
  switch (columnDataType) {
    case 'integer':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'text':
    case 'character varying':
      return 'string';
    default:
      return undefined;
  }
}

function convertToColumnType(attributeType: AttributeType): string {
  switch (attributeType) {
    case 'string':
      return 'varchar';
    case 'boolean':
      return 'boolean';
    case 'number':
      return 'integer';
  }
}

// TODO: create utility method to convert between postgres types and user types i.e. bunch of switch statemtents
// TODO: create utility method to convert column types (incl nullability) to user types
