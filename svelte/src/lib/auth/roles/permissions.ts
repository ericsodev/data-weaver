import { InstanceAuthorization } from './instancePermissions';
import { SchemaAuthorization } from './schemaPermissions';

type Ability<R extends string, A extends string> = `${R}:${A}`;

export interface ResourceAuthorizer<Action extends string, Resource extends string> {
  canI(ability: Ability<Resource, Action>, resourceId: string, userId: string): Promise<boolean>;
  getAbilities(resourceId: string, userId: string): Promise<Ability<Resource, Action>[]>;
}

export const permissions = {
  schema: new SchemaAuthorization(),
  instance: new InstanceAuthorization()
};
