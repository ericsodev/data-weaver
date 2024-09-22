import { Model, mixin, type JSONSchema, type QueryContext } from 'objection';
import { BaseModel } from './base';
import { User } from './user.model';
import { Schema, type SchemaDTO } from './schema.model';
import type { Except } from 'type-fest';
import type { AttributeValue } from './attribute.types';
import { db } from '../actions';

export class Instance extends mixin(BaseModel) {
  name!: string;
  creatorId!: string;
  schemaId!: string;
  schema?: SchemaDTO;
  attributes!: Record<string, AttributeValue>;
  description?: string;

  static get tableName() {
    return 'instance';
  }

  async $afterInsert(ctx: QueryContext) {
    await super.$afterInsert(ctx);
    await this.transformAfterRead();
  }

  async $afterFind(ctx: QueryContext) {
    await super.$afterFind(ctx);
    await this.transformAfterRead();
  }

  async $beforeDelete(queryContext: QueryContext): Promise<void> {
    await super.$beforeDelete(queryContext);
    await db.instanceData.deleteInstanceData(this.id);
  }

  private async transformAfterRead() {
    const ret = await db.instanceData.getInstanceData(this.id, this.schemaId);
    this.attributes = ret?.attributes ?? {};
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['name', 'schemaId', 'creatorId'],
      properties: {
        name: { type: 'string', minLength: 1, maxLength: 32 },
        creatorId: { type: 'string' },
        schemaId: { type: 'string' },
        description: { type: 'string' }
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
export type CreateInstanceDTO = Except<Instance, keyof BaseModel | 'schema' | 'attributes'>;
