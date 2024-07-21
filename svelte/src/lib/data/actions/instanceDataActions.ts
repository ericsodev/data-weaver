import { isBoolean, isNull, isNumber, isString } from 'util';
import { db } from '.';
import type { InstanceDataDTO } from '../models/instanceDataModel';
import { Model } from 'objection';

export class InstanceDataAction {
  public async getInstanceData(instanceId: string): Promise<InstanceDataDTO | undefined> {
    const instance = await db.instance.find({ id: instanceId }, 'schema');
    if (!instance || !instance.schema) {
      throw new Error('Error getting instance data: Instance or schema does not exist.');
    }

    const tableName = instance.schema.dataTableName;
    const row = await Model.query()
      .knex()
      .select<{ id: string; instance_id: string } & Record<string, unknown>>('*')
      .where('instanceId', instanceId)
      .from(tableName)
      .first();

    if (!row) {
      return;
    }

    const attributes = transformAttributeColumns(row);

    return {
      id: row.id,
      instanceId: row.instance_id,
      attributes
    };
  }
}

/**
 * Takes a row retrieved from the database and extracts all attribute columns to their actual names
 * e.g. {"attr_fullname": "john"} becomes {"fullname": "john"}
 * Non-attribute columns are omitted
 */
function transformAttributeColumns(
  data: Record<string, unknown>
): Record<string, boolean | number | string | null> {
  const ret: Record<string, boolean | number | string | null> = {};
  for (const key in data) {
    if (!key.startsWith('attr_')) continue;

    if (isNumber(data[key]) || isString(data[key]) || isBoolean(data[key]) || isNull(data[key])) {
      const newKey = key.slice(5);
      ret[newKey] = data[key];
    }
  }

  return ret;
}
