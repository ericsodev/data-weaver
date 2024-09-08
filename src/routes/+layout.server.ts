import { removePrototype } from '$lib/utils/toPojo';

export const load = ({ locals }) => {
  return {
    user: locals.user && removePrototype(locals.user)
  };
};
