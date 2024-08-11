import {
  Model,
  type AnyQueryBuilder,
  type ModelObject,
  type ModelOptions,
  type Modifiers,
  type QueryContext,
  type ToJsonOptions
} from 'objection';
import { v4 as uuidv4 } from 'uuid';

export class BaseModel extends Model {
  id!: string;
  createdAt!: string;
  updatedAt!: string;
  deletedAt!: string;

  static modifiers: Modifiers<AnyQueryBuilder> = {
    nonDeleted(query) {
      query.whereNull('deletedAt');
    }
  };

  static get $id() {
    return 'id';
  }

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

  override toJSON(opt?: ToJsonOptions): ModelObject<this> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json: any = super.toJSON(opt);
    delete json.deletedAt;
    return json;
  }
}
