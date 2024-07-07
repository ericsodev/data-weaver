import type { Schema } from '../models/schemaModel';
import { BaseActions } from './baseActions';

export class SchemaAction extends BaseActions<typeof Schema, 'attributes'> {
  protected model: typeof Schema;

  constructor(model: typeof Schema) {
    super(model);
    this.model = model;
  }
}
