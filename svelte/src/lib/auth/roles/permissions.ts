import { InstanceAuthorization } from './instancePermissions';
import { SchemaAuthorization } from './schemaPermissions';

export interface ResourceAuthorizer<Ability extends string> {
  canI(ability: Ability, resourceId: string, userId: string): Promise<boolean>;
  canIMany<T extends Ability[]>(
    abilities: T,
    resourceId: string,
    userId: string
  ): Promise<Record<T[number], boolean>>;
  getAbilities(resourceId: string, userId: string): Promise<Ability[]>;
}

export const permissions = {
  schema: new SchemaAuthorization(),
  instance: new InstanceAuthorization()
};
