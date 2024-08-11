import { removePrototype } from '$lib/utils/toPojo';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  return {
    user: locals.user && removePrototype(locals.user)
  };
};
