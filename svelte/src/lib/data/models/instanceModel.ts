import { Model, mixin, type JSONSchema, type QueryContext } from 'objection';
import { BaseModel } from './base';
import { User } from './userModel';
import { Schema, type SchemaDTO } from './schemaModel';
import type { Except } from 'type-fest';
import type { AttributeType } from './attributeModel';
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
  dataTableName!: string;

  static get tableName() {
    return 'instance';
  }

  $afterInsert(ctx: QueryContext) {
    // TODO: insert a new row into the data table
    super.$afterInsert(ctx);
    this.transformAfterRead();
  }

  $afterFind(ctx: QueryContext) {
    super.$afterFind(ctx);
    return this.transformAfterRead();
  }

  private transformAfterRead() {}

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
export type CreateInstanceDTO = Except<
  Instance,
  keyof BaseModel | 'schema' | 'attributes' | 'instanceTableName'
>;
