import { Model, mixin } from 'objection';
import { BaseModel } from './base';
import { User } from './userModel';
import { Attribute } from './attributeModel';

export class Schema extends mixin(BaseModel) {
  name!: string;
  creatorId!: string;

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
        relation: Model.ManyToManyRelation,
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
export type CreateSchemaDTO = Omit<Schema, keyof BaseModel>;
export type FilterSchemaDTO = Partial<Omit<Schema, keyof Model>>;

//export interface DataSchema {
//    schema_name: string;
//    attributes: Attribute[];
//}
//export type Attribute = {
//    name: string;
//    type: AttributeType;
//    required: boolean;
//};
//
//export type TableColumn = {
//    table_name: string;
//    column_name: string;
//    data_type: string;
//    is_nullable: string;
//};
//
//export type AttributeType = "string" | "boolean" | "number";
//
//export async function getSchemas(): Promise<Schema[]> {
//    return await db<Schema>("schema");
//}
//
//export async function listDataSchemas(): Promise<Pick<Schema, "schema_name" | "schema_id">[]> {
//    return await db<Schema>("schema").returning(["schema_name", "schema_id"]);
//}
//
//export async function getDataSchemaByName(schema_name: string): Promise<DataSchema | undefined> {
//    const tableName = convertSchemaToTableName(schema_name);
//    if (!(await db.schema.hasTable(tableName))) return undefined;
//
//    const dataSchemaColumns = await db<TableColumn>("information_schema.columns").where({
//        table_name: tableName,
//    });
//
//    if (dataSchemaColumns.length === 0) return undefined;
//
//    // Extract and parse data attributes
//    const attributes: Attribute[] = dataSchemaColumns
//        .filter(col => col.column_name.indexOf("attr_") == 0)
//        .map(parseAttribute)
//        .filter(attr => !!attr) as Attribute[];
//
//    return {
//        schema_name,
//        attributes,
//    };
//}
//
//// TODO: may 8: the function below, add front end view for schema page
//
//// TODO: Checks whether a schema name can be added after converting to table name
//export async function dataSchemaNameExists() {}
//
//export async function getDataSchemaById(schema_id: number): Promise<DataSchema | undefined> {
//    const schema = await db<Schema>("schema").where({ schema_id }).returning(["schema_id", "schema_name"]).first();
//
//    if (!schema) return undefined;
//
//    // Data schemas table names are the schema name prefixed by schema_
//
//    return await getDataSchemaByName(schema.schema_name);
//}
