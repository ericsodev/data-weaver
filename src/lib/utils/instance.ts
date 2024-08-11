import { db } from '$lib/data/actions';
import type { CreateInstanceDTO, InstanceDTO } from '$lib/data/models/instance.model';

export async function createInstanceWithPermission(
  instance: CreateInstanceDTO
): Promise<InstanceDTO | undefined> {
  const instanceRet = await db.instance.create(instance);
  if (!instanceRet) return;

  await db.instancePermission.create({
    userId: instanceRet.creatorId,
    instanceId: instanceRet.id,
    role: 'OWNER'
  });

  return instanceRet;
}
