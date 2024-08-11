import { isBoolean, isNumber, isString } from 'util';
import { db } from '.';
import type { InstanceDataDTO } from '../models/instance-data.model';
import { Model } from 'objection';
import { randomUUID } from 'crypto';
import type { AttributeValue } from '../models/attribute.types';

export class InstanceDataAction {
  public async getInstanceData(
    instanceId: string,
    schemaId: string
  ): Promise<InstanceDataDTO | undefined> {
    const schema = await db.schema.find({ id: schemaId });
    if (!schema) {
      throw new Error('Error getting instance data: Instance or schema does not exist.');
    }

    const tableName = schema.dataTableName;
    const row = await Model.query()
      .knex()
      .select<{ id: string; instance_id: string } & Record<string, unknown>>('*')
      .where('instance_id', instanceId)
      .from(tableName)
      .first();

    if (!row) {
      return;
    }

    const attributes = transformAttributeColumnsToObject(row);

    return {
      id: row.id,
      instanceId: row.instance_id,
      attributes
    };
  }

  public async updateInstanceData(instanceId: string, data: Record<string, AttributeValue>) {
    const instance = await db.instance.find({ id: instanceId }, 'schema');
    if (!instance || !instance.schema) {
      throw new Error('Instance or schema not found.');
    }

    const tableName = instance.schema.dataTableName;
    const dbData = transformDataObjectToColumns(data);
    const row = await Model.query()
      .knex()
      .select('*')
      .from(instance.schema.dataTableName)
      .where('instance_id', instanceId);

    if (row.length === 0) {
      await Model.query()
        .knex()
        .insert({ id: randomUUID(), instanceId: instanceId, ...dbData })
        .into(tableName);
      return;
    }
    await Model.query().knex().table(tableName).update(dbData).where('instance_id', instanceId);
  }

  public async deleteInstanceData(instanceId: string) {
    const instance = await db.instance.find({ id: instanceId }, 'schema');
    if (!instance || !instance.schema) {
      throw new Error('Instance or schema not found.');
    }

    const tableName = instance.schema.dataTableName;
    await Model.query().knex().table(tableName).where('instance_id', instanceId).del();
  }
}

/**
 * Takes a row retrieved from the database and extracts all attribute columns to their actual names
 * e.g. {"attrFullname": "john"} becomes {"fullname": "john"}
 * Non-attribute columns are omitted
 */
function transformAttributeColumnsToObject(
  data: Record<string, unknown>
): Record<string, boolean | number | string | null> {
  const ret: Record<string, boolean | number | string | null> = {};
  for (const key in data) {
    if (!key.startsWith('attr$')) continue;

    if (isNumber(data[key]) || isString(data[key]) || isBoolean(data[key]) || data[key] === null) {
      const newKey = key.slice(5);
      ret[newKey] = data[key];
    }
  }

  return ret;
}

function transformDataObjectToColumns(data: Record<string, AttributeValue>) {
  const ret: Record<string, boolean | number | string | null> = {};
  for (const [key, val] of Object.entries(data)) {
    ret[`attr_$${key}`] = val;
  }

  return ret;
}
