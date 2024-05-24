import { redirect, type Action, type Actions, error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { schemaFormSchema } from '../schema';
import { createSchemaWithPermission } from '$lib/utils/schema';

export const load: PageServerLoad = async ({ request }) => {
  const params = new URLSearchParams(request.url.toString());
  const name = params.get('name');

  const form = await superValidate(request, zod(schemaFormSchema));
  form.data.name = name ? name : '';
  return { form };
};

const createSchemaHandler: Action = async ({ request, locals }) => {
  const form = await superValidate(request, zod(schemaFormSchema));
  if (!form.valid) {
    return error(400, 'Invalid form');
  }

  if (!locals.user) {
    return error(401, 'You must be logged in to create a schema');
  }

  const data = form.data;
  const schema = await createSchemaWithPermission({ name: data.name, creatorId: locals.user.id });

  if (schema) {
    return redirect(300, `/schema/id/${schema.id}`);
  }
  return error(409, 'Schema exists');
};
export const actions: Actions = {
  default: createSchemaHandler
};
