import { db } from '$lib/data/actions';
import { USER_ROLES } from '$lib/data/models/role.model';
import type { RedactedUserDTO } from '$lib/data/models/user.model';
import { removePrototype } from '$lib/utils/toPojo';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  if (!locals.user?.id) {
    redirect(300, '/');
  }

  const users = (await db.user.findAll({}, 'roles')) ?? [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const redactedUser: RedactedUserDTO[] = users.map(({ passwordHash, ...user }) => {
    return user;
  });

  return {
    users: removePrototype(redactedUser),
    roles: USER_ROLES
  };
};
