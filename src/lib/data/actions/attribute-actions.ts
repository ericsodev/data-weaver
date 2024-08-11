import type { TransactionOrKnex } from 'objection';
import type { Attribute, AttributeDTO, CreateAttributeDTO } from '../models/attribute.model';
import { BaseActions } from './base-actions';

export class AttributeActions extends BaseActions<typeof Attribute> {
  protected model: typeof Attribute;

  constructor(model: typeof Attribute) {
    super(model);
    this.model = model;
  }

  async upsert(
    data: CreateAttributeDTO & { id?: string },
    trx?: TransactionOrKnex
  ): Promise<AttributeDTO | undefined> {
    try {
      const rowData: CreateAttributeDTO = {
        name: data.name,
        schemaId: data.schemaId,
        type: data.type,
        required: data.required
      };

      // If ID is provided, must be an update
      // If ID is not provided must be an insert

      if (data.id) {
        const currentRow = await this.model
          .query(trx)
          .where({ id: data.id, schemaId: data.schemaId })
          .first();

        if (!currentRow) {
          return undefined;
        }

        return await this.model
          .query(trx)
          .where({ id: data.id })
          .update(rowData)
          .returning('*')
          .first();
      } else {
        return await this.model.query(trx).insert(rowData);
      }
    } catch (error: unknown) {
      console.log(error);
      return undefined;
    }
  }

  async batchUpsert(data: CreateAttributeDTO[]): Promise<boolean> {
    const trx = await this.model.startTransaction();
    for (const attr of data) {
      const res = await this.upsert(attr, trx);
      if (!res) {
        trx.rollback();
        return false;
      }
    }
    trx.commit();
    return true;
  }
}
