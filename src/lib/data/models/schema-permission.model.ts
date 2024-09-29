import { Model, mixin, type JSONSchema } from 'objection';
import { BaseModel } from './base';
import { Schema, type SchemaDTO } from './schema.model';
import { User, type UserDTO } from './user.model';
import type { Except } from 'type-fest';

export const SCHEMA_USER_ROLES = ['OWNER', 'ADMIN', 'EDITOR', 'VIEWER'] as const;

export type SchemaUserRole = (typeof SCHEMA_USER_ROLES)[number];

export class SchemaPermission extends mixin(BaseModel) {
  public schemaId!: string;
  public userId!: string;
  public role!: SchemaUserRole;

  public user!: UserDTO;
  public schema!: SchemaDTO;

  static get tableName() {
    return 'schema_permission';
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['userId', 'schemaId', 'role'],
      properties: {
        userId: { type: 'string' },
        schemaId: { type: 'string' },
        role: { enum: [...SCHEMA_USER_ROLES] }
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
