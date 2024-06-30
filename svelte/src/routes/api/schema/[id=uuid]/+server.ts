import { db } from '$lib/data/actions';
import { schemaPutValidation } from '$lib/validationSchemas/api/schema';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ params, request, locals }) => {
  const payload = await request.json();
  const valPayload = schemaPutValidation.safeParse(payload);
  const schemaId = params.id;

  if (!valPayload.success) {
    console.log(valPayload.error);
    return error(400, { message: 'Validation error' });
  }

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

  if (name) {
    // Update schema name
    if (name !== perms.schema?.name) {
      await db.schema.update({ id: schemaId, name });
    }
  }

  if (attributes) {
    // Update attributes
    if (new Set(attributes.map((a) => a.name)).size !== attributes.length) {
      return error(404, { message: 'Duplicate attribute names' });
    }

    const toUpsert = attributes.filter((attr) => !attr.delete);
    const toDelete = attributes.filter((attr) => attr.delete);

    for (const attr of toDelete) {
      if (!attr.id) continue;
      await db.attribute.delete({ id: attr.id });
    }
    await db.attribute.batchUpsert(toUpsert.map((attr) => ({ ...attr, schemaId })));
  }

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
