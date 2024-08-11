import { error, redirect } from '@sveltejs/kit';
import { removePrototype } from '$lib/utils/toPojo';

export const load = ({ locals, cookies }) => {
  const user = locals.user;

  if (!user) {
    redirect(301, '/login');
  }

  if (user.roles.length === 0) {
    cookies.delete('data-weaver-session', { path: '/' });
    error(401, { message: 'The administrator has not assigned a role to your account.' });
  }

  return {
    user: removePrototype(user)
  };
};
