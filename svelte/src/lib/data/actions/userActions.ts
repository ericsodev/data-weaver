import { sha256 } from 'js-sha256';
import type { CreateUserDTO, FindUserDTO, User, UserDTO } from '../models/userModel';

export class UserAction {
  protected model: typeof User;

  constructor(model: typeof User) {
    this.model = model;
  }
  async createUser(newUser: CreateUserDTO): Promise<UserDTO> {
    return await this.model.query().insert({
      name: newUser.name,
      passwordHash: sha256(newUser.password),
      userRole: newUser.userRole
    });
  }

  async findUser({ name }: FindUserDTO): Promise<UserDTO | undefined> {
    return await this.model.query().where({ name }).first();
  }
}
