import type { Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { loginFormSchema } from './schema';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { db } from '$lib/data/actions';
import { sha256 } from 'js-sha256';
import { signSession } from '$lib/validationSchemas/cookie';
import { v4 as uuidv4 } from 'uuid';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const loginForm = await superValidate(request, zod(loginFormSchema));

    if (!loginForm.valid) {
      return setError(loginForm, 'password', 'Error parsing form');
    }

    const data = loginForm.data;
    const user = await db.user.find({ name: data.username });

    if (user && user.passwordHash === sha256(data.password)) {
      cookies.set('data-weaver-session', await signSession({ session_id: uuidv4(), id: user.id }), {
        path: '/'
      });
      return redirect(300, '/authed/dashboard');
    }

    return setError(loginForm, 'password', 'Invalid login');
  }
};
