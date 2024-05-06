import type { Knex } from 'knex';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

// Update with your config settings.
//
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      database: 'dataweaver',
      user: 'dataweaver',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, './migrations')
    },
    seeds: {
      directory: path.join(__dirname, './seeds')
    }
  },
  production: {
    client: 'pg',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};

export default config;
