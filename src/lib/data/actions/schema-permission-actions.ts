import type { SchemaPermission, SchemaPermissionDTO } from '../models/schema-permission.model';
import { BaseActions } from './base-actions';

export class SchemaPermissionAction extends BaseActions<
  typeof SchemaPermission,
  'schema' | 'user'
> {
  async listAuthorizedSchemas(userId: string): Promise<SchemaPermissionDTO[]> {
    const schemas = await this.model.query().where('user_id', userId).withGraphFetched('schema');
    return schemas;
  }

  async getAuthorizationLevel(
    filters: Pick<SchemaPermissionDTO, 'userId' | 'schemaId'>
  ): Promise<SchemaPermissionDTO['role'] | undefined> {
    const res = await this.model.query().where(filters).first();

    return res?.role;
  }
}
