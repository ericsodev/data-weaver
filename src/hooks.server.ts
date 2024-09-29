import { permissions } from '$lib/auth/roles/permissions';
import { db } from '$lib/data/actions';
import { verifyJwt } from '$lib/utils/jwt';
import { cookieSchema } from '$lib/validation-schemas/cookie';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  try {
    const cookie = event.cookies.get('data-weaver-session');

    if (cookie) {
      const validatedCookie = await verifyJwt(cookie);
      const parsedCookie = cookieSchema.safeParse(validatedCookie);
      if (!parsedCookie.success) {
        return resolve(event);
      }

      // TODO: Add session validation
      const user = await db.user.find({ id: parsedCookie.data.id }, 'roles');
      if (user) {
        const abilities = await permissions.system.getAbilities(user.id);
        event.locals.user = { name: user.name, id: user.id, roles: user.roles, abilities };
      }
    }

    if (isProtectedRoute(event.url.pathname) && !event.locals.user) {
      throw redirect(303, '/login');
    }

    const response = resolve(event);
    return response;
  } catch (error) {
    console.log(error);
    return resolve(event);
  }
};

function isProtectedRoute(path: string): boolean {
  return path.startsWith('/authed');
}
