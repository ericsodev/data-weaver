import type { User } from '../models/userModel';
import { BaseActions } from './baseActions';

export class UserAction extends BaseActions<typeof User> {
  protected model: typeof User;

  constructor(model: typeof User) {
    super(model);
    this.model = model;
  }
}
