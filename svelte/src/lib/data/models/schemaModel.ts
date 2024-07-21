import { Model, mixin, type QueryContext } from 'objection';
import { BaseModel } from './base';
import { User } from './userModel';
import { Attribute, type AttributeDTO } from './attributeModel';
import { camelToSnakeCase } from '$lib/utils/camelToSnake';
import type { SchemaType } from './schema.types';

export class Schema extends mixin(BaseModel) {
  name!: string;
  creatorId!: string;
  attributes?: AttributeDTO[];
  dataTableName!: string;
  schemaType!: SchemaType;

  async $beforeInsert(queryContext: QueryContext): Promise<void> {
    await super.$beforeInsert(queryContext);
    this.dataTableName = `data_${camelToSnakeCase(this.name)}`;
    console.log('1.3');
    await queryContext.transaction.transaction(async (knex) => {
      await knex.schema.createTable(this.dataTableName, (table) => {
        table.uuid('id').primary();
        table
          .uuid('instanceId')
          .references('instance.id')
          .onDelete('CASCADE')
          .onUpdate('CASCADE')
          .notNullable();
      });
    });
    console.log(this);
  }

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
export type CreateSchemaDTO = Omit<Schema, keyof BaseModel | 'attributes' | 'dataTableName'>;
export type FilterSchemaDTO = Partial<Omit<Schema, keyof Model>>;
