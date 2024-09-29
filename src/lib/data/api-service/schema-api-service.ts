import type { SchemaUserListResponse } from '$lib/validationSchemas/api/schema-users';

export async function listSchemaUsers(schemaId: string): Promise<SchemaUserListResponse> {
  const result = await fetch(`/api/schema/${schemaId}/users`);
  return await result.json();
}
