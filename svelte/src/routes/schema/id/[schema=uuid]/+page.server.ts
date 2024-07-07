import { db } from '$lib/data/actions';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { removePrototype } from '$lib/utils/toPojo';
import { permissions } from '$lib/auth/roles/permissions';

/** @type {import('./$types').PageServerLoad} */
export const load: PageServerLoad = async ({ params, locals, depends }) => {
  // Load a single data schema

  if (!locals.user) {
    redirect(401, 'You are not logged in.');
  }

  if (!params.schema) {
    redirect(301, '/schema');
  }

  const userAuthLevel = await db.schemaPermission.getAuthorizationLevel({
    schemaId: params.schema,
    userId: locals.user.id
  });

  depends('app:random');
  const schema = await db.schema.find({ id: params.schema }, 'attributes');
  if (!userAuthLevel || !schema) {
    error(400, { message: 'Schema not found' });
  }

  const abilities = await permissions.schema.getAbilities(schema.id, locals.user.id);

  if (!abilities.includes('SCHEMA:READ')) {
    error(401, { message: 'Unauthorized to read schema' });
  }

  return { schema: { ...removePrototype(schema), accessType: userAuthLevel }, abilities };
};
