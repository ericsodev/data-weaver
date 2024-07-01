import { Model, mixin } from 'objection';
import { BaseModel } from './base';
import { User } from './userModel';
import { Attribute, type AttributeDTO } from './attributeModel';

export class Schema extends mixin(BaseModel) {
  name!: string;
  creatorId!: string;
  attributes?: AttributeDTO[];

  static get tableName() {
    return 'schema';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'creatorId'],
      properties: {
        name: { type: 'string' },
        creatorId: { type: 'string' }
      }
    };
  }

  static get relationMappings() {
    return {
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'schema.creatorId',
          to: 'user.id'
        }
      },
      attributes: {
        relation: Model.HasManyRelation,
        modelClass: Attribute,
        join: {
          from: 'schema.id',
          to: 'attribute.schemaId'
        }
      },
      authorizedUsers: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'schema.id',
          through: {
            from: 'schema_permission.schemaId',
            to: 'schema_permissions.userId'
          },
          to: 'user.id'
        }
      }
    };
  }
}

export type SchemaDTO = Omit<Schema, keyof Model>;
export type CreateSchemaDTO = Omit<Schema, keyof BaseModel | 'attributes'>;
export type FilterSchemaDTO = Partial<Omit<Schema, keyof Model>>;
