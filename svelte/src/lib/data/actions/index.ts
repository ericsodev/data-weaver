// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Model from '../database';

import { User } from '../models/userModel';
import { UserAction } from './userActions';

import { SchemaAction } from './schemaActions';
import { Schema } from '../models/schemaModel';
import { SchemaPermissionAction } from './schemaPermissionActions';
import { SchemaPermission } from '../models/schemaPermissionModel';
import { AttributeActions } from './attributeActions';
import { Attribute } from '../models/attributeModel';
import { InstancePermission } from '../models/instancePermissionModel';
import { InstancePermissionAction } from './instancePermissionActions';
import { InstanceAction } from './instanceActions';
import { Instance } from '../models/instanceModel';

const db = {
  user: new UserAction(User),
  schema: new SchemaAction(Schema),
  instance: new InstanceAction(Instance),
  schemaPermission: new SchemaPermissionAction(SchemaPermission),
  instancePermission: new InstancePermissionAction(InstancePermission),
  attribute: new AttributeActions(Attribute)
};

export { db };
