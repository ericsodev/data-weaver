import { error, type Actions } from '@sveltejs/kit';
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

    // validate permissions to see schema
    const canReadSchema = await permissions.schema.canI(
      'SCHEMA:READ',
      form.data.schemaId,
      event.locals.user.id
    );

    if (!canReadSchema) {
      return fail(401, { form });
    }

    // TODO:permissions to create instances

    await createInstanceWithPermission({
      ...form.data,
      creatorId: event.locals.user.id
    });

    return {
      form
    };
  }
};
