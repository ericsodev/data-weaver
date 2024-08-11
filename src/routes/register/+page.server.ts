import { redirect, type Actions } from '@sveltejs/kit';
import { registerSchema } from './schema';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { db } from '$lib/data/actions';
import { sha256 } from 'js-sha256';
import { USER_ROLES } from '$lib/data/models/role.model';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    // register user
    const registerForm = await superValidate(request, zod(registerSchema));

    const data = registerForm.data;

    const nameTaken = await db.user.find({ name: data.username });

    if (nameTaken) {
      return setError(registerForm, 'username', 'Username is taken');
    }

    let role: USER_ROLES | undefined;
    const existingUsers = await db.user.findAll({});
    if (existingUsers && existingUsers.length === 0) {
      // First user is assigned the owner role
      role = USER_ROLES.OWNER;
    }

    const user = await db.user.create({
      name: data.username,
      passwordHash: sha256(data.password)
    });

    if (role) {
      await db.role.create({ name: role, userId: user.id, assignerId: user.id }); // he assigned himself
    }

    cookies.set('data-weaver-session', JSON.stringify({ session_id: 5, username: user.name }), {
      path: '/'
    });
    return redirect(300, '/');
  }
};
