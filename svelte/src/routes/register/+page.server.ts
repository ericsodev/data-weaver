import { redirect, type Actions } from '@sveltejs/kit';
import { registerSchema } from './schema';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { db } from '$lib/data/actions';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    // register user
    const registerForm = await superValidate(request, zod(registerSchema));

    const data = registerForm.data;

    const user = await db.user.createUser({
      name: data.username,
      password: data.password,
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
