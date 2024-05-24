import type { SchemaPermission } from '../models/schemaPermissionModel';
import { BaseActions } from './baseActions';

export class SchemaPermissionAction extends BaseActions<typeof SchemaPermission> {
  protected model: typeof SchemaPermission;

  constructor(model: typeof SchemaPermission) {
    super(model);
    this.model = model;
  }

  async listAuthorizedSchemas(userId: string): Promise<SchemaPermission[]> {
    console.log('listing schemas');
    const schemas = await this.model.query().where('user_id', userId).withGraphFetched('schema');
    return schemas;
  }
}
