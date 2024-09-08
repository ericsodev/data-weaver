import { db } from '$lib/data/actions';
import type { InstanceRole } from '$lib/data/models/instance-permission.model';
import type { ResourceAuthorizer } from './permissions';

/*
 * These are permissions scoped to a specific instance.
 */

const INSTANCE_ACTIONS = ['WRITE', 'READ', 'DELETE', 'UPDATE', 'MANAGE'] as const;
const INSTANCE_RESOURCES = ['INSTANCE', 'NAME', 'ATTRIBUTE'] as const;

const INSTANCE_ABILITIES = {
  NAME: ['READ', 'WRITE'],
  INSTANCE: ['MANAGE', 'DELETE', 'READ'],
  ATTRIBUTE: ['READ', 'WRITE']
} satisfies Record<(typeof INSTANCE_RESOURCES)[number], InstanceAction[]>;

type Ability = typeof INSTANCE_ABILITIES;

type InstanceResource = (typeof INSTANCE_RESOURCES)[number];
type InstanceAction = (typeof INSTANCE_ACTIONS)[number];
export type InstanceAbility = {
  [Property in keyof Ability]: `${Property}:${Ability[Property][number]}`;
}[InstanceResource];

export class InstanceAuthorization implements ResourceAuthorizer<InstanceAbility> {
  public async getAbilities(instanceId: string, userId: string): Promise<InstanceAbility[]> {
    const authLevel = await db.instancePermission.getAuthorizationLevel({ instanceId, userId });

    if (!authLevel) {
      return [];
    }

    return ROLE_ABILITIES[authLevel];
  }

  public async canI(
    ability: InstanceAbility,
    instanceId: string,
    userId: string
  ): Promise<boolean> {
    const authLevel = await db.instancePermission.getAuthorizationLevel({
      instanceId,
      userId
    });

    if (!authLevel) {
      return false;
    }

    return ROLE_ABILITIES[authLevel].includes(ability);
  }

  public async canIMany<T extends InstanceAbility[]>(
    abilities: T,
    instanceId: string,
    userId: string
  ): Promise<Record<T[number], boolean>> {
    const authLevel = await db.instancePermission.getAuthorizationLevel({
      instanceId,
      userId
    });

    if (!authLevel) {
      return abilities.reduce(
        (acc, ability) => {
          acc[ability] = false;
          return acc;
        },
        {} as Record<InstanceAbility, boolean>
      );
    }

    return abilities.reduce(
      (acc, ability) => {
        acc[ability] = ROLE_ABILITIES[authLevel].includes(ability);
        return acc;
      },
      {} as Record<InstanceAbility, boolean>
    );
  }
}

const ROLE_ABILITIES: Record<InstanceRole, InstanceAbility[]> = {
  OWNER: [
    'NAME:READ',
    'NAME:WRITE',
    'INSTANCE:READ',
    'INSTANCE:DELETE',
    'INSTANCE:MANAGE',
    'ATTRIBUTE:WRITE',
    'ATTRIBUTE:READ'
  ],
  ADMIN: ['NAME:READ', 'NAME:WRITE', 'INSTANCE:READ', 'ATTRIBUTE:WRITE', 'ATTRIBUTE:READ'],
  EDITOR: ['NAME:READ', 'INSTANCE:READ', 'ATTRIBUTE:WRITE', 'ATTRIBUTE:READ'],
  VIEWER: ['NAME:READ', 'INSTANCE:READ', 'ATTRIBUTE:READ']
} as const;
