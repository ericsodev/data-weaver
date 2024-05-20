import { Model, mixin } from 'objection';
import { BaseModel } from './base';

const USER_ROLES = ['admin', 'creator', 'instance_creator', 'viewer'] as const;
type UserRole = (typeof USER_ROLES)[number];

export class User extends mixin(BaseModel) {
  public name!: string;
  public passwordHash!: string;
  public userRole!: UserRole;

  static get tableName() {
    return 'user';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'passwordHash', 'userRole'],
      properties: {
        name: { type: 'string', minLength: 1, maxLength: 64 },
        passwordHash: { type: 'string', minLength: 64, maxLength: 64 },
        userRole: { enum: [...USER_ROLES] }
      }
    };
  }
}

export type UserDTO = Omit<User, keyof Model>;
export type FindUserDTO = Pick<User, 'name'>;
export type CreateUserDTO = Omit<User, keyof BaseModel | 'passwordHash'> & { password: string };
