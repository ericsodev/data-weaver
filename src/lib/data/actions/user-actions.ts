import type { User } from '../models/user.model';
import { BaseActions } from './base-actions';

export class UserAction extends BaseActions<typeof User> {
  protected model: typeof User;

  constructor(model: typeof User) {
    super(model);
    this.model = model;
  }
}
