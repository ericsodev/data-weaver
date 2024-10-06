import { permissions } from '$lib/auth/roles/permissions';
import { db } from '$lib/data/actions';
import type { SchemaUserListResponse } from '$lib/validation-schemas/api/schema-users';
import { error, json } from '@sveltejs/kit';

export const GET = async ({ locals, params }) => {
  if (!locals.user) {
    error(401);
  }

  const canManage = await permissions.schema.canI('SCHEMA:MANAGE', params.id, locals.user.id);

  if (!canManage) {
    error(401);
  }

  const users: SchemaUserListResponse =
    (await db.schemaPermission.findAll({ schemaId: params.id }, 'user')) ?? [];

  return json(users);
};
