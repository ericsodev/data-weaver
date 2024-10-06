import { db } from '$lib/data/actions';
import type { SCHEMA_USER_ROLES } from '$lib/data/models/schema-permission.types';
import type { ResourceAuthorizer } from './permissions';

/*
 * These are permissions scoped to a specific schema.
 */

const SCHEMA_ACTIONS = ['WRITE', 'READ', 'DELETE', 'MANAGE'] as const;
const SCHEMA_RESOURCES = ['NAME', 'SCHEMA', 'ATTRIBUTE'] as const;

type SchemaAction = (typeof SCHEMA_ACTIONS)[number];
type SchemaResource = (typeof SCHEMA_RESOURCES)[number];

const SCHEMA_ABILITIES = {
  NAME: ['READ', 'WRITE'],
  SCHEMA: ['DELETE', 'READ', 'MANAGE'],
  ATTRIBUTE: ['READ', 'WRITE', 'DELETE']
} as const satisfies Record<SchemaResource, SchemaAction[]>;

export type SchemaAbility = {
  [Resource in keyof typeof SCHEMA_ABILITIES]: `${Resource}:${(typeof SCHEMA_ABILITIES)[Resource][number]}`;
}[SchemaResource];

export class SchemaAuthorization implements ResourceAuthorizer<SchemaAbility> {
  public async getAbilities(schemaId: string, userId: string): Promise<SchemaAbility[]> {
    const authLevel = await db.schemaPermission.getAuthorizationLevel({ schemaId, userId });
    return authLevel ? ROLE_ABILITIES[authLevel] : [];
  }

  public async canI(ability: SchemaAbility, schemaId: string, userId: string): Promise<boolean> {
    const authLevel = await db.schemaPermission.getAuthorizationLevel({
      schemaId,
      userId
    });

    return authLevel ? ROLE_ABILITIES[authLevel].includes(ability) : false;
  }

  public async canIMany<T extends SchemaAbility[]>(
    abilities: T,
    schemaId: string,
    userId: string
  ): Promise<Record<T[number], boolean>> {
    const authLevel = await db.schemaPermission.getAuthorizationLevel({
      schemaId,
      userId
    });

    if (!authLevel) {
      return abilities.reduce(
        (acc, ability) => {
          acc[ability] = false;
          return acc;
        },
        {} as Record<SchemaAbility, boolean>
      );
    }

    return abilities.reduce(
      (acc, ability) => {
        acc[ability] = ROLE_ABILITIES[authLevel].includes(ability);
        return acc;
      },
      {} as Record<SchemaAbility, boolean>
    );
  }
}
const OWNER_ABILITIES: SchemaAbility[] = [
  'SCHEMA:READ',
  'SCHEMA:DELETE',
  'SCHEMA:MANAGE',
  'NAME:READ',
  'NAME:WRITE',
  'ATTRIBUTE:READ',
  'ATTRIBUTE:WRITE',
  'ATTRIBUTE:DELETE'
];
const ADMIN_ABILITIES: SchemaAbility[] = [
  'SCHEMA:READ',
  'SCHEMA:MANAGE',
  'NAME:READ',
  'NAME:WRITE',
  'ATTRIBUTE:READ',
  'ATTRIBUTE:WRITE',
  'ATTRIBUTE:DELETE'
] as const;

const EDITOR_ABILITIES: SchemaAbility[] = [
  'SCHEMA:READ',
  'NAME:READ',
  'ATTRIBUTE:READ',
  'ATTRIBUTE:WRITE',
  'ATTRIBUTE:DELETE'
] as const;

const VIEWER_ABILITIES: SchemaAbility[] = ['SCHEMA:READ', 'ATTRIBUTE:READ', 'NAME:READ'] as const;

const ROLE_ABILITIES: Record<(typeof SCHEMA_USER_ROLES)[number], SchemaAbility[]> = {
  OWNER: OWNER_ABILITIES,
  ADMIN: ADMIN_ABILITIES,
  EDITOR: EDITOR_ABILITIES,
  VIEWER: VIEWER_ABILITIES
};
