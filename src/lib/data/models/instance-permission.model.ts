import { mixin, Model } from 'objection';
import { BaseModel } from './base';
import { Instance, type InstanceDTO } from './instance.model';
import { User } from './user.model';
import type { Except } from 'type-fest';

export const INSTANCE_USER_ROLES = ['OWNER', 'ADMIN', 'EDITOR', 'VIEWER'] as const;
export type InstanceRole = (typeof INSTANCE_USER_ROLES)[number];

export class InstancePermission extends mixin(BaseModel) {
  public instanceId!: string;
  public userId!: string;
  public role!: InstanceRole;
  public instance?: InstanceDTO;

  static get tableName() {
    return 'instance_permission';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'instanceId', 'role'],
      properties: {
        userId: { type: 'string' },
        instanceId: { type: 'string' },
        role: { enum: [...INSTANCE_USER_ROLES] }
      }
    };
  }

  static get relationMappings() {
    return {
      instance: {
        relation: Model.BelongsToOneRelation,
        modelClass: Instance,
        join: {
          from: 'instance_permission.instanceId',
          to: 'instance.id'
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'instance_permission.userId',
          to: 'user.id'
        }
      }
    };
  }
}

export type InstancePermissionDTO = Except<InstancePermission, keyof Model>;
