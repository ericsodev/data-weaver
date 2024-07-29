import { Model, mixin, type JSONSchema, type ModelOptions, type QueryContext } from 'objection';
import { BaseModel } from './base';
import { Schema, type SchemaDTO } from './schemaModel';
import type { Except } from 'type-fest';
import { db } from '../actions';
import { type AttributeType, ATTRIBUTE_TYPES } from './attribute.types';

export class Attribute extends mixin(BaseModel) {
  name!: string;
  schemaId!: string;
  type!: AttributeType;
  required!: boolean;

  async $afterInsert(queryContext: QueryContext): Promise<void> {
    await super.$afterInsert(queryContext);

    // Update existing data schema
    const schema = await this.$knex()
      .select<SchemaDTO>('*')
      .from('schema')
      .where('id', this.schemaId)
      .first();

    if (!schema) throw Error('Schema does not exist');

    await queryContext.transaction.schema.alterTable(schema.dataTableName, (table) => {
      const column = 'attr_$' + this.name;
      if (this.type === 'string') {
        table.string(column).nullable();
      } else if (this.type === 'boolean') {
        table.boolean(column).nullable();
      } else {
        table.integer(column).nullable();
      }
    });
  }

  async $afterUpdate(opt: ModelOptions, queryContext: QueryContext): Promise<void> {
    await super.$afterUpdate(opt, queryContext);

    // Update existing data schema
    const schema = await this.$knex()
      .select<SchemaDTO>('*')
      .from('schema')
      .where('id', this.schemaId)
      .first();

    if (!schema) throw Error('Schema does not exist');

    await queryContext.transaction.schema.alterTable(schema.dataTableName, (table) => {
      const column = 'attr_$' + this.name;
      if (this.type === 'string') {
        table.string(column).nullable().alter();
      } else if (this.type === 'boolean') {
        table.boolean(column).nullable().alter();
      } else {
        table.integer(column).nullable().alter();
      }
    });
  }

  async $beforeDelete(queryContext: QueryContext): Promise<void> {
    await super.$beforeDelete(queryContext);

    const attribute = await db.attribute.find({ id: this.id });
    if (!attribute) throw new Error('Attribute does not exist');

    // Update existing data schema
    const schema = await this.$modelClass
      .query()
      .knex()
      .select<SchemaDTO>('*')
      .from('schema')
      .where('id', attribute.schemaId)
      .first();

    if (!schema) throw Error('Schema does not exist');

    await queryContext.transaction.schema.alterTable(schema.dataTableName, (table) => {
      const column = 'attr_$' + attribute.name;
      table.dropColumn(column);
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
