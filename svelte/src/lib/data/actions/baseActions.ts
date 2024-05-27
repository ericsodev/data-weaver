import type { Model, RelationExpression } from 'objection';
import type { BaseModel } from '../models/base';
import type { Except, RequireAtLeastOne } from 'type-fest';

type GenericDTO<T extends typeof BaseModel> = Except<InstanceType<T>, keyof Model>;
type GenericCreateDTO<T extends typeof BaseModel> = Except<InstanceType<T>, keyof BaseModel>;

export class BaseActions<T extends typeof BaseModel> {
  protected model: T;

  constructor(model: T) {
    this.model = model;
  }

  async find(
    filters: Partial<GenericDTO<T>>,
    relations?: RelationExpression<InstanceType<T>>
  ): Promise<GenericDTO<T> | undefined> {
    try {
      const ret = await this.model
        .query()
        .where(filters)
        .modify((qb, relExpr) => {
          if (relExpr) {
            qb.withGraphFetched(relExpr);
          }
        }, relations)
        .first();
      return ret as unknown as GenericDTO<T>;
    } catch (error: unknown) {
      console.log(error as string);
      return undefined;
    }
  }

  async findAll(
    filters: Partial<GenericDTO<T>>,
    relations?: RelationExpression<InstanceType<T>>
  ): Promise<GenericDTO<T>[] | undefined> {
    try {
      const ret = await this.model
        .query()
        .where(filters)
        .modify((qb, relExpr) => {
          if (relExpr) {
            qb.withGraphFetched(relExpr);
          }
        }, relations);
      return ret as unknown as GenericDTO<T>[];
    } catch (error: unknown) {
      console.log(error as string);
      return undefined;
    }
  }

  async create(data: GenericCreateDTO<T>): Promise<GenericDTO<T> | undefined> {
    try {
      const ret = await this.model.query().insert(data);
      return ret as unknown as GenericDTO<T>;
    } catch (error: unknown) {
      console.log(error as string);
      return undefined;
    }
  }

  async update(
    data: RequireAtLeastOne<GenericCreateDTO<T>> & { id: string }
  ): Promise<GenericDTO<T> | undefined> {
    try {
      const ret = await this.model.query().patchAndFetchById(data.id, data);
      return ret as unknown as GenericDTO<T>;
    } catch (error: unknown) {
      console.log(error as string);
      return undefined;
    }
  }

  async delete(data: { id: string }): Promise<boolean | undefined> {
    try {
      const numRows = await this.model.query().deleteById(data.id);
      return numRows === 1;
    } catch (error: unknown) {
      return undefined;
    }
  }
}
