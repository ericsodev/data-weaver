import knex from 'knex';
import { config } from '../../../knex/knexfile';

const environment = process.env.ENVIRONMENT || 'development';

const db = knex(config[environment]);

export default db;
