import { permissions } from '$lib/auth/roles/permissions';
import { db } from '$lib/data/actions';
import type { RedactedUserDTO } from '$lib/data/models/user.model';
import { error, json } from '@sveltejs/kit';

export const GET = async ({ locals }) => {
  if (!locals.user) {
    error(401);
  }

  const canReadUser = await permissions.system.canI('USER:READ', locals.user.id);
  if (!canReadUser) {
    error(401);
  }

  const users: RedactedUserDTO[] = (await db.user.findAll({}, 'roles')) ?? [];
  return json(users.filter((user) => user.roles.length > 0));
};
