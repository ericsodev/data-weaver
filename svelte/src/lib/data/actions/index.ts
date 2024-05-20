// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Model from '../database';

import { User } from '../models/userModel';
import { UserAction } from './userActions';

import { SchemaAction } from './schemaActions';
import { Schema } from '../models/schemaModel';

const db = {
  user: new UserAction(User),
  schema: new SchemaAction(Schema)
};

export { db };
