import {
  Model,
  mixin,
  type JSONSchema,
  type QueryContext,
  type StaticHookArguments
} from 'objection';
import { BaseModel } from './base';
import { User } from './userModel';
import { Schema, type SchemaDTO } from './schemaModel';
import type { Except } from 'type-fest';
import type { AttributeType } from './attributeModel';
import { createInstanceTable } from '../utils/createInstanceTable';
import { db } from '../actions';

type AttributeValueDTO<T extends AttributeType = never> = {
  name: string;
  type: T;
  value: T extends 'number' ? number : T extends 'string' ? string : boolean;
};

export class Instance extends mixin(BaseModel) {
  name!: string;
  creatorId!: string;
  schemaId!: string;
  schema?: SchemaDTO;
  attributes!: AttributeValueDTO[];
  tableName!: string;

  static get tableName() {
    return 'instance';
  }

  async $beforeInsert(queryContext: QueryContext): Promise<void> {
    const schema = await db.schema.find({ id: this.schemaId }, 'attributes');

    if (!schema) {
      queryContext.transaction.rollback();
      throw new Error('Error creating instance: schema does not exist');
    }

    const tableName = await createInstanceTable(schema);
    this.tableName = tableName;
  }

  static afterInsert({ result }: StaticHookArguments<Instance, Record<string, unknown>[]>) {
    if (!result) {
      return result;
    }

    return this.transformAfterRead(result);
  }

  static afterFind({ result }: StaticHookArguments<Instance, Record<string, unknown>[]>) {
    if (!result) {
      return result;
    }

    return this.transformAfterRead(result);
  }

  private static transformAfterRead(result: Record<string, unknown>[]) {
    const transformed: InstanceDTO[] = [];
    for (const row of result) {
      const newRow: Record<string, unknown> = {};
      const attributes: AttributeValueDTO<AttributeType>[] = [];

      for (const key in row) {
        if (!key.startsWith('attr_')) {
          newRow[key] = row[key];
        }

        attributes.push(
          this.transformAttribute(key.slice(5), row[key] as string | number | boolean)
        );
      }
    }

    return transformed;
  }

  private static transformAttribute(
    key: string,
    value: string | number | boolean
  ): AttributeValueDTO<'string' | 'boolean' | 'number'> {
    if (typeof value === 'string') {
      return {
        name: key,
        type: 'string',
        value: value
      };
    } else if (typeof value === 'boolean') {
      return {
        name: key,
        type: 'boolean',
        value: value
      };
    } else {
      return {
        name: key,
        type: 'number',
        value: value
      };
    }
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['name', 'schemaId', 'creatorId'],
      properties: {
        name: { type: 'string', minLength: 1, maxLength: 32 },
        creatorId: { type: 'string' },
        schemaId: { type: 'string' }
      }
    };
  }

  static get relationMappings() {
    return {
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'instance.creatorId',
          to: 'user.id'
        }
      },
      schema: {
        relation: Model.BelongsToOneRelation,
        modelClass: Schema,
        join: {
          from: 'instance.schemaId',
          to: 'schema.id'
        }
      }
    };
  }
}

export type InstanceDTO = Except<Instance, keyof Model>;
export type CreateInstanceDTO = Except<Instance, keyof BaseModel | 'schema'>;
