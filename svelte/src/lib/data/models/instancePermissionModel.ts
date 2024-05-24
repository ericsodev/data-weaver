import { mixin } from 'objection';
import { BaseModel } from './base';

const INSTANCE_PERMISSIONS = ['ADMIN', 'WRITE', 'READ'] as const;
type InstanceAccessTypes = (typeof INSTANCE_PERMISSIONS)[number];

export class InstancePermission extends mixin(BaseModel) {
  public instanceId!: string;
  public userId!: string;
  public accessType!: InstanceAccessTypes;

  static get tableName() {
    return 'instance_permission';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'instanceId', 'accessType'],
      properties: {
        userId: { type: 'string' },
        instanceId: { type: 'string' },
        accessType: { enum: [...INSTANCE_PERMISSIONS] }
      }
    };
  }
}
