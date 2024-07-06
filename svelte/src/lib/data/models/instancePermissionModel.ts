import { mixin, Model } from 'objection';
import { BaseModel } from './base';
import { Instance, type InstanceDTO } from './instanceModel';
import { User } from './userModel';

const INSTANCE_USER_ROLES = ['OWNER', 'ADMIN', 'EDITOR', 'VIEWER'] as const;
type InstanceAccessTypes = (typeof INSTANCE_USER_ROLES)[number];

export class InstancePermission extends mixin(BaseModel) {
  public instanceId!: string;
  public userId!: string;
  public accessType!: InstanceAccessTypes;
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
        accessType: { enum: [...INSTANCE_USER_ROLES] }
      }
    };
  }

  static get relationMappings() {
    return {
      schema: {
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
