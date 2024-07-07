import { db } from '$lib/data/actions';
import type { ResourceAuthorizer } from './permissions';
import type { InstanceRole } from '$lib/data/models/instancePermissionModel';

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
}[keyof Ability];

export class InstanceAuthorization implements ResourceAuthorizer<InstanceAction, InstanceResource> {
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
