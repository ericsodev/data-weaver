import { db } from '$lib/data/actions';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  try {
    if (!locals.user) {
      redirect(301, '/login');
    }

    console.log('hihihi');
    const authedInstances = await db.instancePermission.listAuthorizedInstances(locals.user.id);
    const instances = authedInstances
      .filter((a) => a.instance !== undefined)
      .map((s) => {
        return {
          id: s.instance?.id as string,
          name: s.instance?.name as string,
          schemaId: s.instance?.schemaId as string,
          role: s.role,
          createdAt: s.createdAt
        };
      });
    return { instances };
  } catch (error: unknown) {
    return { instances: [] };
  }
};
