import { db } from '$lib/data/actions';
import type { ResourceAuthorizer } from './permissions';

export const SCHEMA_ACTIONS = ['WRITE', 'READ', 'DELETE', 'UPDATE'] as const;

export type SchemaResource = { name: 'SCHEMA'; id: string } | { name: 'ATTRIBUTE'; id: string };
export type SchemaAction = (typeof SCHEMA_ACTIONS)[number];
export type SchemaAbility = `${SchemaResource['name']}:${SchemaAction}`;

export class SchemaAuthorization implements ResourceAuthorizer<SchemaAction, SchemaResource> {
  public async getAbilities(schemaId: string, userId: string): Promise<SchemaAbility[]> {
    const authLevel = await db.schemaPermission.getAuthorizationLevel({ schemaId, userId });
    switch (authLevel) {
      case 'ADMIN':
        return ADMIN_ABILITIES;
      case 'WRITE':
        return EDITOR_ABILITIES;
      case 'READ':
        return VIEWER_ABILITIES;
    }
    return [];
  }

  public async canI(
    resource: SchemaResource,
    action: SchemaAction,
    userId: string
  ): Promise<boolean> {
    const authLevel = await db.schemaPermission.getAuthorizationLevel({
      schemaId: resource.id,
      userId
    });

    switch (authLevel) {
      case 'ADMIN':
        return ADMIN_ABILITIES.includes(`${resource.name}:${action}`);
      case 'READ':
        return VIEWER_ABILITIES.includes(`${resource.name}:${action}`);
      case 'WRITE':
        return EDITOR_ABILITIES.includes(`${resource.name}:${action}`);
    }
    return false;
  }
}

const ADMIN_ABILITIES: SchemaAbility[] = [
  'SCHEMA:READ',
  'SCHEMA:WRITE',
  'SCHEMA:UPDATE',
  'SCHEMA:DELETE',
  'ATTRIBUTE:READ',
  'ATTRIBUTE:WRITE',
  'ATTRIBUTE:UPDATE',
  'ATTRIBUTE:DELETE'
] as const;

const EDITOR_ABILITIES: SchemaAbility[] = [
  'SCHEMA:READ',
  'ATTRIBUTE:READ',
  'ATTRIBUTE:WRITE',
  'ATTRIBUTE:UPDATE',
  'ATTRIBUTE:DELETE'
] as const;

const VIEWER_ABILITIES: SchemaAbility[] = ['SCHEMA:READ', 'ATTRIBUTE:READ'] as const;
