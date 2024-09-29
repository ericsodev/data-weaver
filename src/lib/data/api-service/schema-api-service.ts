import type { SchemaUserListResponse } from '$lib/validation-schemas/api/schema-users';

export async function listSchemaUsers(schemaId: string): Promise<SchemaUserListResponse> {
  const result = await fetch(`/api/schema/${schemaId}/users`);
  return await result.json();
}
