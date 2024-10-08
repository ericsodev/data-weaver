import type {
  InstancePermission,
  InstancePermissionDTO
} from '../models/instance-permission.model';
import { BaseActions } from './base-actions';

export class InstancePermissionAction extends BaseActions<typeof InstancePermission, 'instance'> {
  protected model: typeof InstancePermission;

  constructor(model: typeof InstancePermission) {
    super(model);
    this.model = model;
  }

  async listAuthorizedInstances(userId: string): Promise<InstancePermissionDTO[]> {
    const instances = await this.model.query().where({ userId }).withGraphFetched('instance');
    return instances;
  }

  async getAuthorizationLevel(
    filters: Pick<InstancePermissionDTO, 'userId' | 'instanceId'>
  ): Promise<InstancePermissionDTO['role'] | undefined> {
    const res = await this.model.query().where(filters).first();

    return res?.role;
  }
}
