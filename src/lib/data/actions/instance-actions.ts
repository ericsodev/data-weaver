import type { Instance } from '../models/instance.model';
import { BaseActions } from './base-actions';

export class InstanceAction extends BaseActions<typeof Instance, 'schema' | 'attributes'> {
  protected model: typeof Instance;
  constructor(model: typeof Instance) {
    super(model);
    this.model = model;
  }
}
