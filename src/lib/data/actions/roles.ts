import type { CreateRoleDTO, DeleteManyRoleDTO, Role } from '../models/role.model';
import { BaseActions } from './base-actions';

export class RoleActions extends BaseActions<typeof Role> {
  public deleteMany = async (data: DeleteManyRoleDTO): Promise<void> => {
    await this.model.query().where('userId', data.userId).whereIn('name', data.role).delete();
  };

  public createMany = async (data: CreateRoleDTO[]): Promise<void> => {
    await this.model.query().insert(data);
  };
}
