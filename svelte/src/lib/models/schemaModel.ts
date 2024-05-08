import db from "$lib/db/knex";
import { convertSchemaToTableName, parseAttribute } from "$lib/utils/schema";

export interface Schema {
    schema_id: number;
    schema_name: string;
    created_at: Date;
    updated_at: Date;
    creator_id?: number;
}

export interface DataSchema {
    schema_id: number;
    schema_name: string;
    attributes: { string: Attribute };
}

export type Attribute = {
    name: string;
    type: AttributeType;
    required: boolean;
};

export type TableColumn = {
    table_name: string;
    column_name: string;
    data_type: string;
    is_nullable: string;
};

export type AttributeType = "string" | "boolean" | "number";

export async function getSchemas(): Promise<Schema[]> {
    return await db<Schema>("schema");
}

export async function listDataSchemas(): Promise<Pick<Schema, "schema_name" | "schema_id">[]> {
    return await db<Schema>("schema").returning(["schema_name", "schema_id"]);
}

export async function getDataSchemaByName(schemaName: string): Promise<DataSchema | undefined> {
    const tableName = convertSchemaToTableName(schemaName);
    if (!(await db.schema.hasTable(tableName))) return undefined;

    const dataSchemaColumns = await db<TableColumn>("information_schema.columns").where({
        table_name: tableName,
    });

    if (dataSchemaColumns.length === 0) return undefined;

    // Extract and parse data attributes
    const attributes: Attribute[] = dataSchemaColumns
        .filter(col => col.column_name.indexOf("attr_") == 0)
        .map(parseAttribute)
        .filter(attr => !!attr) as Attribute[];
}

export async function getDataSchemaById(schema_id: number): Promise<DataSchema | undefined> {
    const schema = await db<Schema>("schema").where({ schema_id }).returning(["schema_id", "schema_name"]).first();

    if (!schema) return undefined;

    // Data schemas table names are the schema name prefixed by schema_

    return await getDataSchemaByName(schema.schema_name);
}
