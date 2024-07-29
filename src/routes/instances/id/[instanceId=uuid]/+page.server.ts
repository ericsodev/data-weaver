import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/data/actions';
import { permissions } from '$lib/auth/roles/permissions';
import { removePrototype } from '$lib/utils/toPojo';

export const load: PageServerLoad = async ({ locals, params }) => {
  const instanceId = params['instanceId'];

  if (!instanceId) redirect(301, '/instances');
  if (!locals.user) redirect(401, '/login');

  const abilities = await permissions.instance.getAbilities(instanceId, locals.user.id);
  if (!abilities.includes('INSTANCE:READ')) {
    if (!instanceId) error(401, 'Unauthorized');
  }

  const instance = await db.instance.find({ id: instanceId }, 'schema.attributes');
  if (!instance?.schema) error(400, 'Missing schema');

  return { instance: removePrototype(instance), abilities };
};
