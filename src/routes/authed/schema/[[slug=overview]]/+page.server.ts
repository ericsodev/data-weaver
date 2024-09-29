import { redirect, type Action, type Actions, error } from '@sveltejs/kit';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { createSchemaWithPermission } from '$lib/utils/schema';
import { schemaPostValidation } from '$lib/validation-schemas/api/schema';

export const load: PageServerLoad = async ({ request }) => {
  const params = new URLSearchParams(request.url.toString());
  const name = params.get('name');

  const form = await superValidate(request, zod(schemaPostValidation));
  form.data.name = name ? name : '';
  return { form };
};

const createSchemaHandler: Action = async ({ request, locals }) => {
  if (!locals.user) {
    return error(401, 'You must be logged in to create a schema');
  }

  const form = await superValidate(request, zod(schemaPostValidation));
  if (!form.valid) {
    return fail(400, { message: 'Invalid form' });
  }

  if (!locals.user?.abilities.includes('SCHEMA:CREATE')) {
    return setError(form, '', 'You do not have authorization to create a schema.');
  }

  const data = form.data;
  const schema = await createSchemaWithPermission({
    name: data.name,
    creatorId: locals.user.id,
    description: data.description,
    schemaType: 'Single'
  });

  if (schema) {
    return redirect(300, `/authed/schema/id/${schema.id}`);
  }
  return error(409, 'Schema exists');
};

export const actions: Actions = {
  default: createSchemaHandler
};
