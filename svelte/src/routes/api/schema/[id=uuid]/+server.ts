import { db } from '$lib/data/actions';
import { schemaValidation } from '$lib/validationSchemas/schemaPost';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ params, request, locals }) => {
  const payload = await request.json();
  const valPayload = schemaValidation.safeParse(payload);
  const schemaId = params.id;

  if (!valPayload.success) {
    return error(400, { message: 'Validation error' });
  }
  console.log(valPayload.data);

  if (!schemaId) {
    return error(400, { message: 'Missing id' });
  }

  if (!locals.user) {
    return error(401, { message: 'Unauthorized' });
  }

  const perms = await db.schemaPermission.find(
    {
      schemaId,
      userId: locals.user.id
    },
    'schema'
  );

  if (perms?.accessType !== 'WRITE' && perms?.accessType !== 'ADMIN') {
    return error(401, { message: 'Unauthorized' });
  }

  // Ensure attributes have unique names
  const { name, attributes } = valPayload.data;
  if (new Set(attributes.map((a) => a.name)).size !== attributes.length) {
    return error(404, { message: 'Duplicate attribute names' });
  }

  if (name !== perms.schema.name) {
    await db.schema.update({ id: schemaId, name });
  }

  await db.attribute.batchUpsert(attributes.map((attr) => ({ ...attr, schemaId })));

  // TODO: Handle deletions

  return json('');
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  const schemaId = params.id;
  if (!schemaId) {
    return error(400, { message: 'Missing id' });
  }

  if (!locals.user) {
    return error(401, { message: 'Unauthorized' });
  }

  const perms = await db.schemaPermission.getAuthorizationLevel({
    userId: locals.user.id,
    schemaId
  });

  if (perms !== 'ADMIN') {
    return error(401, { message: 'Unauthorized' });
  }

  const schema = await db.schema.delete({ id: schemaId });
  if (!schema) {
    return error(404, { message: 'Schema not found' });
  }
  return json('');
};
