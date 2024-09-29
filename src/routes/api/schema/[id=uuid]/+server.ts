import { permissions } from '$lib/auth/roles/permissions';
import { db } from '$lib/data/actions';
import type { InstanceDTO } from '$lib/data/models/instance.model';
import { schemaPutValidation } from '$lib/validation-schemas/api/schema';
import { error, json } from '@sveltejs/kit';

export const PUT = async ({ params, request, locals }) => {
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

export const DELETE = async ({ params, locals }) => {
  const schemaId = params['id'];
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

  // Cascade delete instances

  const attachedInstances = await db.instance.findAll({ schemaId: params.id });

  if (attachedInstances === undefined) {
    return json([]);
  }

  const userId = locals.user.id;
  const getInstanceAbilities = async (instance: InstanceDTO) => {
    const perms = await permissions.instance.getAbilities(instance.id, userId);
    return {
      ...instance,
      permissions: perms
    };
  };

  const instancePerms = await Promise.all(attachedInstances.map((i) => getInstanceAbilities(i)));

  if (!instancePerms.every((i) => i.permissions.includes('INSTANCE:DELETE'))) {
    error(401, { message: 'Unauthorized to delete attached instances.' });
  }

  for (const instance of attachedInstances) {
    await db.instance.delete(instance);
  }

  const schema = await db.schema.delete({ id: schemaId });
  if (!schema) {
    return error(404, { message: 'Schema not found' });
  }
  return json('');
};
