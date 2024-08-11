import { InstanceAuthorization } from './instance-permissions';
import { SchemaAuthorization } from './schema-permissions';
import { SystemAuthorization } from './system-permissions';

export interface ResourceAuthorizer<Ability extends string> {
  canI(ability: Ability, resourceId: string, userId: string): Promise<boolean>;
  canIMany<T extends Ability[]>(
    abilities: T,
    resourceId: string,
    userId: string
  ): Promise<Record<T[number], boolean>>;
  getAbilities(resourceId: string, userId: string): Promise<Ability[]>;
}

export interface SystemAuthorizer<Ability extends string> {
  canI(ability: Ability, userId: string): Promise<boolean>;
  canIMany<T extends Ability[]>(abilities: T, userId: string): Promise<Record<T[number], boolean>>;
  getAbilities(resourceId: string, userId: string): Promise<Ability[]>;
}

export const permissions = {
  schema: new SchemaAuthorization(),
  instance: new InstanceAuthorization(),
  system: new SystemAuthorization()
};
