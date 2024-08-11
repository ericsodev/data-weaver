import type { Schema } from '../models/schema.model';
import { BaseActions } from './base-actions';

export class SchemaAction extends BaseActions<typeof Schema, 'attributes' | 'dataTableName'> {
  protected model: typeof Schema;

  constructor(model: typeof Schema) {
    super(model);
    this.model = model;
  }
}
