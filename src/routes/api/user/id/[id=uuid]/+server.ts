import { permissions } from '$lib/auth/roles/permissions';
import { db } from '$lib/data/actions';
import { error, json } from '@sveltejs/kit';

export const DELETE = async ({ locals, params }) => {
  const user = locals.user;

  console.log('delete: ', user?.id);
  if (!user) {
    throw error(401, 'Not logged in.');
  }

  const canDelete = await permissions.system.canI('USER:DELETE', user.id);
  console.log('can delete', canDelete);

  if (!canDelete) {
    throw error(401, 'Unauthorized to delete user.');
  }

  await db.user.delete({ id: params.id });

  return json({});
};
