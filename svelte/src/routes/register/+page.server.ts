import { redirect, type Actions } from '@sveltejs/kit';
import { registerSchema } from './schema';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { db } from '$lib/data/actions';
import { sha256 } from 'js-sha256';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    // register user
    const registerForm = await superValidate(request, zod(registerSchema));

    const data = registerForm.data;

    const user = await db.user.create({
      name: data.username,
      passwordHash: sha256(data.password),
      userRole: 'admin' // TODO: change later
    });

    if (!user) {
      return setError(registerForm, 'username', 'Username is taken');
    }

    cookies.set('data-weaver-session', JSON.stringify({ session_id: 5, username: user.name }), {
      path: '/'
    });
    return redirect(300, '/');
  }
};
