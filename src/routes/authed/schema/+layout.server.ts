import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';
import { db } from '$lib/data/actions';

export const load: LayoutServerLoad = async ({ locals }) => {
  try {
    if (!locals.user) {
      redirect(301, '/login');
    }

    const authSchemas = await db.schemaPermission.listAuthorizedSchemas(locals.user.id);
    const schemas = authSchemas
      .filter((a) => a.schema !== undefined)
      .map((s) => {
        return {
          id: s.schema?.id as string,
          name: s.schema?.name as string,
          role: s.role,
          description: s.schema?.description as string | null,
          createdAt: s.createdAt
        };
      });
    return { schemas };
  } catch (error: unknown) {
    return { schemas: [] };
  }
};
