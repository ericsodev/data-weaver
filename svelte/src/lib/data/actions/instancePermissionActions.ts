import type { InstancePermission, InstancePermissionDTO } from '../models/instancePermissionModel';
import { BaseActions } from './baseActions';

export class InstancePermissionAction extends BaseActions<typeof InstancePermission, 'instance'> {
  protected model: typeof InstancePermission;

  constructor(model: typeof InstancePermission) {
    super(model);
    this.model = model;
  }

  async listAuthorizedSchemas(userId: string): Promise<InstancePermissionDTO[]> {
    const schemas = await this.model.query().where('user_id', userId).withGraphFetched('schema');
    return schemas;
  }

  async getAuthorizationLevel(
    filters: Pick<InstancePermissionDTO, 'userId' | 'instanceId'>
  ): Promise<InstancePermissionDTO['role'] | undefined> {
    const res = await this.model.query().where(filters).first();

    return res?.role;
  }
}
