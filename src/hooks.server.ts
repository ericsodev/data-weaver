import { db } from '$lib/data/actions';
import { cookieSchema } from '$lib/validationSchemas/cookie';
import { redirect, type Handle } from '@sveltejs/kit';
/** @type {import('@sveltejs/kit').Handle} */
export const handle: Handle = async ({ event, resolve }) => {
  const cookie = event.cookies.get('data-weaver-session');

  if (cookie) {
    const parsedCookie = cookieSchema.safeParse(JSON.parse(cookie));
    if (!parsedCookie.success) {
      return resolve(event);
    }

    // TODO: Add session validation
    const user = await db.user.find({ id: parsedCookie.data.id });
    if (user) {
      event.locals.user = { name: user.name, id: user.id, userRole: user.userRole };
    }
  }

  if (isProtectedRoute(event.url.pathname) && !event.locals.user) {
    throw redirect(303, '/login');
  }

  const response = resolve(event);
  return response;
};

const protectedRoutes: string[] = ['/dashboard', '/settings', '/account', '/schema', '/data'];

function isProtectedRoute(path: string): boolean {
  return protectedRoutes.map((route) => path.startsWith(route)).some(Boolean);
}
