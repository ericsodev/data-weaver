import { db } from '$lib/data/actions';
import type { USER_ROLES } from '$lib/data/models/role.model';
import type { SystemAuthorizer } from './permissions';

const RESOURCES = ['USER', 'OWNERSHIP', 'SCHEMA', 'INSTANCE'] as const;

type Resource = (typeof RESOURCES)[number];

const ABILITIES = {
  USER: ['READ', 'MANAGE', 'DELETE'],
  OWNERSHIP: ['TRANSFER'],
  SCHEMA: ['READ', 'WRITE', 'CREATE'],
  INSTANCE: ['READ', 'WRITE', 'CREATE']
} as const satisfies Record<Resource, string[]>;

export type SystemAbility = {
  [Resource in keyof typeof ABILITIES]: `${Resource}:${(typeof ABILITIES)[Resource][number]}`;
}[Resource];

const ViewerAbilities: SystemAbility[] = ['SCHEMA:READ', 'INSTANCE:READ'];
const EditorAbilities: SystemAbility[] = [
  'SCHEMA:WRITE',
  'SCHEMA:READ',
  'INSTANCE:WRITE',
  'INSTANCE:READ'
];
const SchemaCreatorAbilities: SystemAbility[] = [
  'SCHEMA:CREATE',
  'SCHEMA:READ',
  'SCHEMA:WRITE'
] as const;

const InstanceCreatorAbilities: SystemAbility[] = [
  'INSTANCE:CREATE',
  'INSTANCE:READ',
  'INSTANCE:WRITE'
] as const;

const AdminAbilities: SystemAbility[] = ['USER:MANAGE', 'USER:DELETE', 'USER:READ'] as const;

const OwnerAbilities: SystemAbility[] = [...AdminAbilities, 'OWNERSHIP:TRANSFER'];

const RoleAbilities: Record<USER_ROLES, SystemAbility[]> = {
  Owner: OwnerAbilities,
  Admin: AdminAbilities,
  'Schema Creator': SchemaCreatorAbilities,
  'Instance Creator': InstanceCreatorAbilities,
  Editor: EditorAbilities,
  Viewer: ViewerAbilities
};

export class SystemAuthorization implements SystemAuthorizer<SystemAbility> {
  async canI(ability: SystemAbility, userId: string): Promise<boolean> {
    const user = await db.user.find({ id: userId }, 'roles');
    if (!user) return false;

    return user.roles.some((role) => RoleAbilities[role.name].includes(ability));
  }

  async canIMany<T extends SystemAbility[]>(
    abilities: T,
    userId: string
  ): Promise<Record<T[number], boolean>> {
    const user = await db.user.find({ id: userId }, 'roles');
    if (!user) {
      return abilities.reduce(
        (acc, ability) => {
          acc[ability] = false;
          return acc;
        },
        {} as Record<SystemAbility, boolean>
      );
    }

    return abilities.reduce(
      (acc, ability) => {
        acc[ability] = user.roles.some((role) => RoleAbilities[role.name].includes(ability));
        return acc;
      },
      {} as Record<SystemAbility, boolean>
    );
  }
  async getAbilities(userId: string): Promise<SystemAbility[]> {
    const user = await db.user.find({ id: userId }, 'roles');
    if (!user) return [];

    const abilities = user.roles.reduce((acc, role) => {
      return [...acc, ...RoleAbilities[role.name]];
    }, [] as SystemAbility[]);

    return [...new Set(abilities)];
  }
}
