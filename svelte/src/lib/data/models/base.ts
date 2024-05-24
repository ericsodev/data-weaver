import { Model, snakeCaseMappers, type ModelOptions, type QueryContext } from 'objection';
import { v4 as uuidv4 } from 'uuid';

export class BaseModel extends Model {
  id!: string;
  createdAt!: string;
  updatedAt!: string;
  deletedAt!: string;

  $beforeInsert(queryContext: QueryContext): void | Promise<unknown> {
    super.$beforeInsert(queryContext);
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.id = uuidv4();
  }

  $beforeUpdate(opt: ModelOptions, queryContext: QueryContext): void | Promise<unknown> {
    super.$beforeUpdate(opt, queryContext);
    this.updatedAt = new Date().toISOString();
  }
}
