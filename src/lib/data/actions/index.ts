// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _Model from '../database';

import { User } from '../models/user.model';
import { UserAction } from './user-actions';

import { SchemaAction } from './schema-actions';
import { Schema } from '../models/schema.model';
import { SchemaPermissionAction } from './schema-permission-actions';
import { SchemaPermission } from '../models/schema-permission.model';
import { AttributeActions } from './attribute-actions';
import { Attribute } from '../models/attribute.model';
import { InstancePermission } from '../models/instance-permission.model';
import { InstancePermissionAction } from './instance-permission-actions';
import { InstanceAction } from './instance-actions';
import { Instance } from '../models/instance.model';
import { InstanceDataAction } from './instance-data-actions';
import { RoleActions } from './roles';
import { Role } from '../models/role.model';

const db = {
  user: new UserAction(User),
  schema: new SchemaAction(Schema),
  instance: new InstanceAction(Instance),
  instancePermission: new InstancePermissionAction(InstancePermission),
  instanceData: new InstanceDataAction(),
  schemaPermission: new SchemaPermissionAction(SchemaPermission),
  attribute: new AttributeActions(Attribute),
  role: new RoleActions(Role)
};

export { db };
