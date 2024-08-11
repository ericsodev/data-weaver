import { db } from '$lib/data/actions';
import { removePrototype } from '$lib/utils/toPojo';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  if (!locals.user?.id) {
    redirect(300, '/');
  }

  console.log('hii');
  const users = (await db.user.findAll({}, 'roles')) ?? [];

  return {
    users: removePrototype(users)
  };
};
