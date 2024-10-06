import { db } from '$lib/data/actions';
import { USER_ROLES } from '$lib/data/models/role.model';
import { updateUserRoleSchema } from '$lib/validation-schemas/api/user-role';
import { error } from '@sveltejs/kit';

export const PUT = async ({ locals, request, params }) => {
  if (!locals.user || !locals.user.abilities.includes('USER:MANAGE')) {
    return error(401, 'Unauthorized');
  }

  const payload = await updateUserRoleSchema.safeParseAsync(await request.json());

  if (payload.error) {
    console.log('Error: ', payload.error);
    return error(400);
  }

  const user = await db.user.find({ id: params.id }, 'roles');

  if (!user) {
    return error(404);
  }

  const existingRoles = user.roles.map((role) => role.name);

  const addedRoles = Object.values(payload.data.roles).filter(
    (role) => !existingRoles.includes(role as USER_ROLES)
  ) as USER_ROLES[];
  const removedRoles = existingRoles.filter(
    (role) => !Object.values(payload.data.roles).includes(role)
  );

  // Cannot transfer ownership through user roles system
  if (removedRoles.includes(USER_ROLES.OWNER) || addedRoles.includes(USER_ROLES.OWNER)) {
    console.log('Error assigning owner');
    return error(400, 'Cannot assign or unassign owner role');
  }
  const assignerId = locals.user.id;

  if (addedRoles.length > 0) {
    await db.role.createMany(
      addedRoles.map((role) => ({ userId: user.id, name: role, assignerId }))
    );
  }

  if (removedRoles.length > 0) {
    await db.role.deleteMany({ userId: user.id, role: removedRoles });
  }

  return new Response('Success');
};
