import { db } from '$lib/data/actions';
import { cookieSchema } from '$lib/validationSchemas/cookie';
import { error, json, type Handle } from '@sveltejs/kit';

export const GET: Handle = async ({ event }) => {
  const session = event.cookies.get('data-weaver-session');
  if (!session) {
    return error(401, 'You are not logged in.');
  }

  const cookieJson = cookieSchema.safeParse(session);
  if (!cookieJson.success) {
    return error(401, 'Invalid session');
  }

  const user = await db.user.find({ id: cookieJson.data.id });
  if (!user) {
    return error(401, 'Invalid session');
  }

  return json({ id: user.id, name: user.name, roles: user.roles });
};
