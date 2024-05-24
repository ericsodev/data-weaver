import { db } from '$lib/data/actions';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  try {
    if (!locals.user) {
      redirect(301, '/login');
    }
    console.log(locals.user);

    const authSchemas = await db.schemaPermission.listAuthorizedSchemas(locals.user.id);
    console.log('waiting');
    const schemas = authSchemas.map((s) => {
      return {
        id: s.schema.id,
        name: s.schema.name,
        accessType: s.accessType,
        createdAt: s.createdAt
      };
    });
    return { schemas };
  } catch (error: unknown) {
    return { schemas: [] };
  }
};
