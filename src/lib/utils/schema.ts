import { db } from '$lib/data/actions';
import type { CreateSchemaDTO, SchemaDTO } from '$lib/data/models/schemaModel';

export async function createSchemaWithPermission(
  schema: CreateSchemaDTO
): Promise<SchemaDTO | undefined> {
  console.log('1');
  const schemaRet = await db.schema.create(schema);
  console.log('2');
  if (!schemaRet) {
    return undefined;
  }
  console.log('3');
  await db.schemaPermission.create({
    userId: schema.creatorId,
    schemaId: schemaRet.id,
    role: 'OWNER'
  });

  return schemaRet;
}
