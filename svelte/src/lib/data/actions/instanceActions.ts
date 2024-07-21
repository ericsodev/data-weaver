import type { Instance } from '../models/instanceModel';
import { BaseActions } from './baseActions';

export class InstanceAction extends BaseActions<typeof Instance, 'schema' | 'attributes'> {
  protected model: typeof Instance;
  constructor(model: typeof Instance) {
    super(model);
    this.model = model;
  }
}
