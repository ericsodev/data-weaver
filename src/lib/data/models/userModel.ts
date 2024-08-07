import { Model, mixin } from 'objection';
import { BaseModel } from './base';

export enum USER_ROLES {
  OWNER = 'Owner',
  ADMIN = 'Admin',
  SCHEMA_CREATOR = 'Schema Creator',
  INSTANCE_CREATOR = 'Instance Creator',
  EDITOR = 'Editor'
}

export class User extends mixin(BaseModel) {
  public name!: string;
  public passwordHash!: string;
  public userRole!: USER_ROLES;

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
        userRole: { enum: Object.values(USER_ROLES) }
      }
    };
  }
}

export type UserDTO = Omit<User, keyof Model>;
export type FindUserDTO = Pick<User, 'name'>;
export type CreateUserDTO = Omit<User, keyof BaseModel | 'passwordHash'> & { password: string };
