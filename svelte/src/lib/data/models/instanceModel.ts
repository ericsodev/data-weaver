import { Model, mixin, type JSONSchema } from 'objection';
import { BaseModel } from './base';
import { User } from './userModel';
import { Schema } from './schemaModel';

export class Instance extends mixin(BaseModel) {
  name!: string;
  creatorId!: string;
  schemaId!: string;

  static get tableName() {
    return 'instance';
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
