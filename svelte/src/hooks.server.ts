import { cookieSchema } from "$lib/schema/cookie";
import { redirect, type Handle } from "@sveltejs/kit";
/** @type {import('@sveltejs/kit').Handle} */
export const handle: Handle = async ({ event, resolve }) => {
	const cookie = event.cookies.get("data-weaver-session");

	if (cookie) {
		const parsedCookie = cookieSchema.safeParse(JSON.parse(cookie));
		if (parsedCookie.success) {
			// TODO: Add session validation
			event.locals.session = parsedCookie.data;
		}
	}

	if (event.url.pathname.startsWith('/dashboard')) {
		if (!event.locals.session) {
			throw redirect(303, '/login')
		}
	}

	const response = resolve(event);
	return response;
}
