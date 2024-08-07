import { redirect, type Actions } from '@sveltejs/kit';
import { registerSchema } from './schema';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { db } from '$lib/data/actions';
import { sha256 } from 'js-sha256';
import { USER_ROLES } from '$lib/data/models/user.model';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    // register user
    const registerForm = await superValidate(request, zod(registerSchema));

    const data = registerForm.data;

    let role: USER_ROLES = USER_ROLES.EDITOR;
    const existingUsers = await db.user.findAll({});
    if (existingUsers && existingUsers.length === 0) {
      // First user is assigned the owner role
      role = USER_ROLES.OWNER;
    }

    const user = await db.user.create({
      name: data.username,
      passwordHash: sha256(data.password),
      userRole: role
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
