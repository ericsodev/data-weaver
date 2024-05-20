import { cookieSchema } from '$lib/schema/cookie';
import { redirect, type Handle } from '@sveltejs/kit';
/** @type {import('@sveltejs/kit').Handle} */
export const handle: Handle = async ({ event, resolve }) => {
  const cookie = event.cookies.get('data-weaver-session');

  if (cookie) {
    const parsedCookie = cookieSchema.safeParse(JSON.parse(cookie));
    if (parsedCookie.success) {
      // TODO: Add session validation
      event.locals.session = parsedCookie.data;
    }
  }

  if (isProtectedRoute(event.url.pathname) && !event.locals.session) {
    throw redirect(303, '/login');
  }

  const response = resolve(event);
  return response;
};

const protectedRoutes: string[] = ['/dashboard', '/settings', '/account', '/schema', '/data'];

function isProtectedRoute(path: string): boolean {
  return protectedRoutes.map((route) => path.startsWith(route)).some(Boolean);
}
