import type { Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { loginFormSchema } from './schema';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { db } from '$lib/data/actions';
import { sha256 } from 'js-sha256';
import { stringifySession } from '$lib/schema/cookie';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const loginForm = await superValidate(request, zod(loginFormSchema));

    if (!loginForm.valid) {
      return setError(loginForm, 'password', 'Error parsing form');
    }

    const data = loginForm.data;
    const user = await db.user.find({ name: loginForm.data.username });

    if (user && user.passwordHash === sha256(data.password)) {
      cookies.set(
        'data-weaver-session',
        stringifySession({ session_id: '8', username: user.name }),
        { path: '/' }
      );
      return redirect(300, '/dashboard');
    }

    return setError(loginForm, 'password', 'Invalid login');
  }
};
