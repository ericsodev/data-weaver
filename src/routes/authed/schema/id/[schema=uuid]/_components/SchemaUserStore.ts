import { listSchemaUsers } from '$lib/data/api-service/schema-api-service';
import type { SchemaUserListResponse } from '$lib/validation-schemas/api/schema-users';
import { writable } from 'svelte/store';

const schemaUsers = writable<SchemaUserListResponse>([]);

async function refreshSchemaUsers(schemaId: string) {
  const ret = await listSchemaUsers(schemaId);
  schemaUsers.set(ret);
}

export default {
  subscribe: schemaUsers.subscribe,
  refresh: refreshSchemaUsers
};
