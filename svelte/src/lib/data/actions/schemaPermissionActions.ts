import type { SchemaPermission, SchemaPermissionDTO } from '../models/schemaPermissionModel';
import { BaseActions } from './baseActions';

export class SchemaPermissionAction extends BaseActions<typeof SchemaPermission> {
  protected model: typeof SchemaPermission;

  constructor(model: typeof SchemaPermission) {
    super(model);
    this.model = model;
  }

  async listAuthorizedSchemas(userId: string): Promise<SchemaPermissionDTO[]> {
    console.log('listing schemas');
    const schemas = await this.model.query().where('user_id', userId).withGraphFetched('schema');
    return schemas;
  }

  async getAuthorizationLevel(
    filters: Pick<SchemaPermissionDTO, 'userId' | 'schemaId'>
  ): Promise<SchemaPermissionDTO['accessType'] | undefined> {
    const res = await this.model.query().where(filters).first();

    return res?.accessType;
  }
}
