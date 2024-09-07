import type { Except } from 'type-fest';
import { BaseModel } from './base';
import type { Model } from 'objection';

export enum USER_ROLES {
  OWNER = 'Owner',
  ADMIN = 'Admin',
  SCHEMA_CREATOR = 'Schema Creator',
  INSTANCE_CREATOR = 'Instance Creator',
  EDITOR = 'Editor',
  VIEWER = 'Viewer'
}

export class Role extends BaseModel {
  static override tableName = 'role';

  public userId!: string;
  public name!: USER_ROLES;
  public assignerId!: string;
}

export type RoleDTO = Except<Role, keyof Model>;
export type CreateRoleDTO = Except<Role, keyof BaseModel>;
export type DeleteManyRoleDTO = { userId: string; role: USER_ROLES[] };
