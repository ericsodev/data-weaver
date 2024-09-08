import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/data/actions';
import { removePrototype } from '$lib/utils/toPojo';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { instanceCreateFormValidation } from '$lib/validationSchemas/api/instance';
import { permissions } from '$lib/auth/roles/permissions';
import { createInstanceWithPermission } from '$lib/utils/instance';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    error(401, { message: 'Unauthorized' });
  }

  const schemas = await db.schemaPermission.listAuthorizedSchemas(locals.user.id);
  return {
    schemas: removePrototype(schemas.map((x) => x.schema).filter((schema) => schema !== undefined)),
    formData: await superValidate(zod(instanceCreateFormValidation))
  };
};
export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(instanceCreateFormValidation));
    if (!form.valid) {
      return fail(400, {
        form
      });
    }

    if (!event.locals.user) return fail(401, { form });

    const canCreateInstance = await permissions.system.canI(
      'INSTANCE:CREATE',
      event.locals.user.id
    );

    if (!canCreateInstance) {
      return fail(401, { form });
    }

    const createdInstance = await createInstanceWithPermission({
      ...form.data,
      creatorId: event.locals.user.id
    });

    if (createdInstance) {
      redirect(300, `/authed/instances/id/${createdInstance.id}`);
    }

    return {
      form
    };
  }
};
