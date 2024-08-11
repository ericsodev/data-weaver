import type { InstanceAbility } from '$lib/auth/roles/instance-permissions';
import { permissions } from '$lib/auth/roles/permissions.js';
import { db } from '$lib/data/actions/';
import type { InstanceDTO } from '$lib/data/models/instance.model.js';
import { error, json } from '@sveltejs/kit';
import type { Merge } from 'type-fest';

export type AttachedInstance = Merge<
  Pick<InstanceDTO, 'id' | 'name'>,
  { permissions: InstanceAbility[] }
>;

/**
 * Returns all the instances that are linked to the current schema
 * Includes data on whether it is deletable by the user
 */
export const GET = async ({ locals, params }) => {
  if (locals.user === undefined) {
    return error(401, 'Unauthorized to view schema');
  }

  await permissions.schema.canI('SCHEMA:READ', params.id, locals.user.id);

  const instances = await db.instance.findAll({ schemaId: params.id });

  if (instances === undefined) {
    return json([]);
  }

  const userId = locals.user.id;
  const getInstanceAbilities = async (instance: InstanceDTO) => {
    const perms = await permissions.instance.getAbilities(instance.id, userId);
    return {
      id: instance.id,
      name: instance.name,
      permissions: perms
    };
  };

  const instanceAbilities: AttachedInstance[] = await Promise.all(
    instances.map((instance) => getInstanceAbilities(instance))
  );

  return json(instanceAbilities);
};
