import { permissions } from '$lib/auth/roles/permissions';
import { db } from '$lib/data/actions';
import { schemaPutValidation } from '$lib/validationSchemas/api/schema';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ params, request, locals }) => {
  const payload = await request.json();
  const valPayload = schemaPutValidation.safeParse(payload);
  const schemaId = params.id;

  if (!valPayload.success) {
    return error(400, { message: 'Validation error' });
  }

  if (!schemaId) {
    return error(400, { message: 'Missing id' });
  }

  if (!locals.user) {
    return error(401, { message: 'Unauthorized' });
  }

  const schema = await db.schema.find({ id: schemaId });
  const perms = await permissions.schema.canIMany(
    ['NAME:WRITE', 'ATTRIBUTE:WRITE', 'ATTRIBUTE:DELETE'],
    schemaId,
    locals.user.id
  );

  const { name, attributes } = valPayload.data;
  const attrToUpsert = attributes?.filter((attr) => !attr.delete) ?? [];
  const attrToDelete = attributes?.filter((attr) => attr.delete) ?? [];

  if (!schema) {
    return error(400, { message: 'Schema does not exist' });
  }

  // Check auth depending on input
  if (schema.name !== name && !perms['ATTRIBUTE:DELETE']) {
    return error(401, { message: 'Unauthorized to modify schema name' });
  }

  if (attrToUpsert.length > 0 && !perms['ATTRIBUTE:WRITE']) {
    return error(401, { message: 'Unauthorized to modify schema attributes' });
  }

  if (attrToDelete.length > 0 && !perms['ATTRIBUTE:DELETE']) {
    return error(401, { message: 'Unauthorized to delete schema attributes' });
  }

  if (name && name !== schema.name) {
    // Update schema name
    await db.schema.update({ id: schemaId, name });
  }

  if (attributes) {
    // Update attributes
    if (new Set(attributes.map((a) => a.name)).size !== attributes.length) {
      return error(404, { message: 'Duplicate attribute names' });
    }

    for (const attr of attrToDelete) {
      if (!attr.id) continue;
      await db.attribute.delete({ id: attr.id });
    }
    await db.attribute.batchUpsert(attrToUpsert.map((attr) => ({ ...attr, schemaId })));
  }

  return json('');
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  const schemaId = params.id;
  if (!schemaId) {
    return error(400, { message: 'Missing id' });
  }

  if (!locals.user) {
    return error(401, { message: 'Unauthorized, not logged in' });
  }

  const canDelete = await permissions.schema.canI('SCHEMA:DELETE', schemaId, locals.user.id);

  if (!canDelete) {
    return error(401, { message: 'Unauthorized' });
  }

  const schema = await db.schema.delete({ id: schemaId });
  if (!schema) {
    return error(404, { message: 'Schema not found' });
  }
  return json('');
};
