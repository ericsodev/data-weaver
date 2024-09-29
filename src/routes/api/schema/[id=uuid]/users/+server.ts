import { SchemaAuthorization } from '$lib/auth/roles/schema-permissions';
import { db } from '$lib/data/actions';
import type { UserListResponse } from '$lib/validationSchemas/api/schema-users';
import { error, json } from '@sveltejs/kit';

export const GET = async ({ locals, params }) => {
  if (!locals.user) {
    error(401);
  }

  const schemaAuth = new SchemaAuthorization();
  const canManage = await schemaAuth.canI('SCHEMA:MANAGE', params.id, locals.user.id);

  if (!canManage) {
    error(401);
  }

  const users: UserListResponse =
    (await db.schemaPermission.findAll({ schemaId: params.id }, 'user')) ?? [];

  return json(users);
};
