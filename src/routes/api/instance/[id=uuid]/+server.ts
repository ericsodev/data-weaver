import { permissions } from '$lib/auth/roles/permissions.js';
import { db } from '$lib/data/actions/index.js';
import { validatorBuilder } from '$lib/utils/validator-builder.js';
import { error, json } from '@sveltejs/kit';

export const PUT = async ({ params, locals, request }) => {
  if (!locals.user?.id) {
    error(401, 'Unauthorized');
  }

  const isPermitted = await permissions.instance.canI('ATTRIBUTE:WRITE', params.id, locals.user.id);
  if (!isPermitted) {
    error(401, 'Unauthorized');
  }

  const instance = await db.instance.find({ id: params.id }, 'schema.attributes');
  if (!instance || !instance.schema) {
    error(400, 'Instance does not exist');
  }

  const payload = await request.json();
  const validator = validatorBuilder(instance.schema.attributes ?? []);
  const validatedPayload = await validator.safeParseAsync(payload);

  if (validatedPayload.error) {
    error(400, validatedPayload.error);
  }

  await db.instanceData.updateInstanceData(params.id, validatedPayload.data);
  return json('success');
};
