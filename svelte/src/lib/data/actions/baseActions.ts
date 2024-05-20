import type { Model } from 'objection';
import type { BaseModel } from '../models/base';
import type { Except, RequireAtLeastOne } from 'type-fest';

type GenericDTO<T extends typeof BaseModel> = Except<InstanceType<T>, keyof Model>;
type GenericCreateDTO<T extends typeof BaseModel> = Except<InstanceType<T>, keyof BaseModel>;

export class BaseActions<T extends typeof BaseModel> {
  protected model: T;

  constructor(model: T) {
    this.model = model;
  }

  // TODO: Figure out typesafe generic actions
  async find(filters: Partial<GenericDTO<T>>): Promise<GenericDTO<T> | undefined> {
    const ret = await this.model.query().where(filters).first();
    return ret as unknown as GenericDTO<T>;
  }

  async findAll(filters: Partial<GenericDTO<T>>): Promise<GenericDTO<T>[]> {
    const ret = (await this.model.query().where(filters)) as unknown as GenericDTO<T>[];
    return ret as unknown as GenericDTO<T>[];
  }

  async create(data: GenericCreateDTO<T>): Promise<GenericDTO<T>> {
    const ret = await this.model.query().insert(data);
    return ret as unknown as GenericDTO<T>;
  }

  async update(
    data: RequireAtLeastOne<GenericCreateDTO<T>> & { id: string }
  ): Promise<GenericDTO<T> | undefined> {
    const ret = await this.model.query().patchAndFetchById(data.id, data);
    return ret as unknown as GenericDTO<T>;
  }
}
