import { Model, mixin, type JSONSchema, type ModelOptions, type QueryContext } from 'objection';
import { BaseModel } from './base';
import { Schema, SchemaDTO } from './schemaModel';
import type { Except } from 'type-fest';
import { convertCamelToSnakeKeys } from '$lib/utils/camelToSnake';
import { db } from '../actions';

export const ATTRIBUTE_TYPES = ['string', 'number', 'boolean'] as const;
export type AttributeType = (typeof ATTRIBUTE_TYPES)[number];
export type AttributeValue = number | string | boolean | null;

export class Attribute extends mixin(BaseModel) {
  name!: string;
  schemaId!: string;
  type!: AttributeType;
  required!: boolean;

  async $afterInsert(queryContext: QueryContext): Promise<void> {
    await super.$afterInsert(queryContext);

    // Update existing data schema
    const schemaRaw = await this.$modelClass
      .query()
      .knex()
      .select<SchemaDTO>('*')
      .from('schema')
      .where('id', this.schemaId)
      .first();

    if (!schemaRaw) throw Error('Schema does not exist');
    const schema = convertCamelToSnakeKeys(schemaRaw);

    await queryContext.transaction.schema.alterTable(schema.dataTableName, (table) => {
      if (this.type === 'string') {
        table.string(this.name).nullable();
      } else if (this.type === 'boolean') {
        table.boolean(this.name).nullable();
      } else {
        table.integer(this.name).nullable();
      }
    });
  }

  async $afterUpdate(opt: ModelOptions, queryContext: QueryContext): Promise<void> {
    await super.$afterUpdate(opt, queryContext);

    // Update existing data schema
    const schemaRaw = await this.$modelClass
      .query()
      .knex()
      .select<SchemaDTO>('*')
      .from('schema')
      .where('id', this.schemaId)
      .first();

    if (!schemaRaw) throw Error('Schema does not exist');
    const schema = convertCamelToSnakeKeys(schemaRaw);

    await queryContext.transaction.schema.alterTable(schema.dataTableName, (table) => {
      if (this.type === 'string') {
        table.string(this.name).nullable().alter();
      } else if (this.type === 'boolean') {
        table.boolean(this.name).nullable().alter();
      } else {
        table.integer(this.name).nullable().alter();
      }
    });
  }

  async $beforeDelete(queryContext: QueryContext): Promise<void> {
    await super.$beforeDelete(queryContext);

    const attribute = await db.attribute.find({ id: this.id });
    if (!attribute) throw new Error('Attribute does not exist');

    // Update existing data schema
    const schemaRaw = await this.$modelClass
      .query()
      .knex()
      .select<SchemaDTO>('*')
      .from('schema')
      .where('id', attribute.schemaId)
      .first();

    if (!schemaRaw) throw Error('Schema does not exist');
    const schema = convertCamelToSnakeKeys(schemaRaw);

    await queryContext.transaction.schema.alterTable(schema.dataTableName, (table) => {
      table.dropColumn(attribute.name);
    });
  }

  static get tableName() {
    return 'attribute';
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['name', 'schemaId', 'type', 'required'],
      properties: {
        name: { type: 'string', minLength: 1, maxLength: 32 },
        schemaId: { type: 'string' },
        type: { enum: [...ATTRIBUTE_TYPES] },
        required: { type: 'boolean' }
      }
    };
  }

  static get relationMappings() {
    return {
      schema: {
        relation: Model.BelongsToOneRelation,
        modelClass: Schema,
        join: {
          from: 'attribute.schema_id',
          to: 'schema.id'
        }
      }
    };
  }
}

export type AttributeDTO = Except<Attribute, keyof Model>;
export type CreateAttributeDTO = Except<Attribute, keyof BaseModel>;
