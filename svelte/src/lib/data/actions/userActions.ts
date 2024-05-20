import { sha256 } from 'js-sha256';
import type { CreateUserDTO, User, UserDTO } from '../models/userModel';
import { BaseActions } from './baseActions';

export class UserAction extends BaseActions<typeof User> {
  protected model: typeof User;

  constructor(model: typeof User) {
    super(model);
    this.model = model;
  }
  async create(newUser: CreateUserDTO): Promise<UserDTO> {
    return await this.model.query().insert({
      name: newUser.name,
      passwordHash: sha256(newUser.password),
      userRole: newUser.userRole
    });
  }
}
