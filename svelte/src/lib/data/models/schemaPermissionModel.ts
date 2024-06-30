import { Model, mixin, type JSONSchema } from 'objection';
import { BaseModel } from './base';
import { Schema, type SchemaDTO } from './schemaModel';
import { User } from './userModel';
import type { Except } from 'type-fest';

const ACCESS_TYPES = ['ADMIN', 'WRITE', 'READ'] as const;

export type SchemaAccessType = (typeof ACCESS_TYPES)[number];

export class SchemaPermission extends mixin(BaseModel) {
  public schemaId!: string;
  public userId!: string;
  public accessType!: SchemaAccessType;

  public schema!: SchemaDTO | undefined;

  static get tableName() {
    return 'schema_permission';
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['userId', 'schemaId', 'accessType'],
      properties: {
        userId: { type: 'string' },
        schemaId: { type: 'string' },
        accessType: { enum: [...ACCESS_TYPES] }
      }
    };
  }

  static get relationMappings() {
    return {
      schema: {
        relation: Model.BelongsToOneRelation,
        modelClass: Schema,
        join: {
          from: 'schema_permission.schemaId',
          to: 'schema.id'
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'schema_permission.userId',
          to: 'user.id'
        }
      }
    };
  }
}

export type SchemaPermissionDTO = Except<SchemaPermission, keyof Model>;
export type CreateSchemaPermissionDTO = Except<SchemaPermission, keyof Model | 'schema'>;
