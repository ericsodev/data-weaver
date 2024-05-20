import { randomUUID } from 'crypto';
import { Model, snakeCaseMappers, type ModelOptions, type QueryContext } from 'objection';

export class BaseModel extends Model {
  id!: string;
  createdAt!: string;
  updatedAt!: string;
  deletedAt!: string;

  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  $beforeInsert(queryContext: QueryContext): void | Promise<any> {
    super.$beforeInsert(queryContext);
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.id = randomUUID();
  }

  $beforeUpdate(opt: ModelOptions, queryContext: QueryContext): void | Promise<any> {
    super.$beforeUpdate(opt, queryContext);
    this.updatedAt = new Date().toISOString();
  }
}
