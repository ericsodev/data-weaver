import {
  Model,
  mixin,
  type QueryContext,
  type RelationMappings,
  type RelationMappingsThunk
} from 'objection';
import { BaseModel } from './base';
import { Role, type RoleDTO } from './role.model';
import type { Except, Merge } from 'type-fest';

export class User extends mixin(BaseModel) {
  public name!: string;
  public passwordHash!: string;
  public roles!: RoleDTO[];

  static get tableName() {
    return 'user';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'passwordHash'],
      properties: {
        name: { type: 'string', minLength: 1, maxLength: 64 },
        passwordHash: { type: 'string', minLength: 64, maxLength: 64 }
      }
    };
  }

  static relationMappings: RelationMappings | RelationMappingsThunk = {
    roles: {
      join: {
        from: 'user.id',
        to: 'role.userId'
      },
      modelClass: Role,
      modify: 'nonDeleted',
      relation: Model.HasManyRelation
    }
  };

  $afterFind(queryContext: UserQueryContext): void {
    if (queryContext.showPassword) return;
    // @ts-expect-error hiding password field unless explicitly requested to show
    delete this.passwordHash;
  }
}

export type UserQueryContext = Merge<QueryContext, { showPassword?: boolean }>;

export type UserDTO = Omit<User, keyof Model>;
export type RedactedUserDTO = Omit<User, keyof Model | 'passwordHash'>;
export type FindUserDTO = Pick<User, 'name'>;
export type CreateUserDTO = Except<User, keyof BaseModel | 'passwordHash' | 'roles'> & {
  password: string;
};
