import knex from 'knex';
import { config } from '../../../knex/knexfile';
import { knexSnakeCaseMappers } from 'objection';

const environment = process.env.ENVIRONMENT || 'development';

const knexDb = knex({ ...config[environment], ...knexSnakeCaseMappers() });

export default knexDb;
