import type { FindUserDTO, User, UserDTO, UserQueryContext } from '../models/user.model';
import { BaseActions } from './base-actions';

export class UserAction extends BaseActions<typeof User, 'roles'> {
  protected model: typeof User;

  constructor(model: typeof User) {
    super(model);
    this.model = model;
  }

  async getWithPassword(filters: FindUserDTO, relations?: string): Promise<UserDTO | undefined> {
    const ret = await this.model
      .query()
      .where(filters)
      .withGraphFetched(relations ?? '')
      .modify('nonDeleted')
      .context({ showPassword: true } as UserQueryContext)
      .first();

    return ret?.toJSON();
  }

  override async delete(data: { id: string }): Promise<boolean | undefined> {
    try {
      await this.model.query().patchAndFetchById(data.id, { deletedAt: new Date().toISOString() });
      return true;
    } catch {
      return false;
    }
  }
}
