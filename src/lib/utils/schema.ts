import { db } from '$lib/data/actions';
import type { CreateSchemaDTO, SchemaDTO } from '$lib/data/models/schema.model';

export async function createSchemaWithPermission(
  schema: CreateSchemaDTO
): Promise<SchemaDTO | undefined> {
  const schemaRet = await db.schema.create(schema);
  if (!schemaRet) {
    return undefined;
  }
  await db.schemaPermission.create({
    userId: schema.creatorId,
    schemaId: schemaRet.id,
    role: 'OWNER'
  });

  return schemaRet;
}
