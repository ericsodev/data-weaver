import { SchemaAuthorization } from './schemaPermissions';

export interface IResource {
  name: string;
}

type Ability<R extends IResource, A extends string> = `${R['name']}:${A}`;

export interface ResourceAuthorizer<Action extends string, Resource extends IResource> {
  canI(resource: Resource, action: Action, userId: string): Promise<boolean>;
  getAbilities(resourceId: string, userId: string): Promise<Ability<Resource, Action>[]>;
}

export const permissions = {
  schema: new SchemaAuthorization()
};
