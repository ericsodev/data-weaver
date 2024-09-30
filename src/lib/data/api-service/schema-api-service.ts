import type {
  SchemaUserListResponse,
  SchemaUserPutPayload
} from '$lib/validation-schemas/api/schema-users';

export async function listSchemaUsers(schemaId: string): Promise<SchemaUserListResponse> {
  const result = await fetch(`/api/schema/${schemaId}/users`);
  return await result.json();
}

export async function addSchemaUser(
  payload: SchemaUserPutPayload
): Promise<Record<string, unknown>> {
  const result = await fetch(`/api/schema/${payload.schemaId}/user`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
  return await result.json();
}
