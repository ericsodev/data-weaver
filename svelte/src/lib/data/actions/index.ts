import { User } from '../models/userModel';
import { UserAction } from './userActions';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Model from '../database';

const db = {
  user: new UserAction(User)
};

export { db };
