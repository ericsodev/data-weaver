import { permissions } from '$lib/auth/roles/permissions';
import { db } from '$lib/data/actions';
import {
  schemaUserDeleteValidation,
  schemaUserPutValidation
} from '$lib/validation-schemas/api/schema-users';
import { error, json } from '@sveltejs/kit';

export const PUT = async ({ locals, params, request }) => {
  try {
    if (!locals.user) {
      error(401);
    }

    const canManageSchema = await permissions.schema.canI(
      'SCHEMA:MANAGE',
      params.id,
      locals.user.id
    );
    if (!canManageSchema) {
      error(401, 'User cannot manage schema');
    }

    const requestBody = await request.json();
    const validated = await schemaUserPutValidation.safeParseAsync(requestBody);

    if (validated.error) {
      error(400, validated.error.toString());
    }

    const payload = validated.data;

    const targetUserPermissions = await permissions.system.canIMany(
      ['SCHEMA:READ', 'SCHEMA:WRITE'],
      payload.userId
    );

    if (
      (!targetUserPermissions['SCHEMA:WRITE'] && payload.role !== 'VIEWER') ||
      !targetUserPermissions['SCHEMA:READ']
    ) {
      error(
        400,
        'Target user does not have schema view or edit permissions and cannot be assigned this role'
      );
    }
    const existingRole = await db.schemaPermission.find({
      userId: payload.userId,
      schemaId: payload.schemaId
    });

    if (existingRole) {
      await db.schemaPermission.update({ id: existingRole.id, role: payload.role });
    } else {
      await db.schemaPermission.create(payload);
    }

    return json({ status: 'Success' });
  } catch (err: unknown) {
    console.log('Error creating schema-user role:', err);
    error(500);
  }
};

export const DELETE = async ({ locals, params, request }) => {
  try {
    if (!locals.user) {
      error(401);
    }

    const canManageSchema = await permissions.schema.canI(
      'SCHEMA:MANAGE',
      params.id,
      locals.user.id
    );
    if (!canManageSchema) {
      error(401);
    }

    const requestBody = await request.json();
    const validated = await schemaUserDeleteValidation.safeParseAsync(requestBody);

    if (validated.error) {
      error(400, validated.error.toString());
    }

    const payload = validated.data;

    if (payload.userId === locals.user.id) {
      error(400, 'Cannot remove yourself from schema');
    }

    await db.schemaPermission.deleteByFilter(payload);
    return json({ status: 'Success' });
  } catch (err: unknown) {
    console.log('Error deleting schema-user role:', err);
    error(500);
  }
};
