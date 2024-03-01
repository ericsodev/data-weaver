import type { Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { loginFormSchema } from './schema';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from "sveltekit-superforms/adapters"
import { findUser } from '$lib/db/auth';
import { sha256 } from 'js-sha256';
import { SessionType, stringifySession } from '$lib/schema/cookie';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const loginForm = await superValidate(request, zod(loginFormSchema));

		if (!loginForm.valid) {
			return setError(loginForm, 'password', 'Error parsing form');
		}

		const data = loginForm.data;
		const user = await findUser(data.username);

		if (user && user.password_hash === sha256(data.password)) {
			cookies.set("data-weaver-session", stringifySession({ session_id: "8", username: user.username }), { path: "/" })
			return redirect(300, "/")
		}

		return setError(loginForm, 'password', "Invalid login")
	}
}
