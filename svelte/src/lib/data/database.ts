import { Model } from 'objection';
import knex from './knex';

// The database connection
Model.knex(knex);

export default Model;
