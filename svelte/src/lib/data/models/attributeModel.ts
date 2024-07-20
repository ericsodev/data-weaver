import { Model, mixin, type JSONSchema } from 'objection';
import { BaseModel } from './base';
import { Schema } from './schemaModel';
import type { Except } from 'type-fest';

export const ATTRIBUTE_TYPES = ['string', 'number', 'boolean'] as const;
export type AttributeType = (typeof ATTRIBUTE_TYPES)[number];
export type AttributeValue = number | string | boolean | null;

export class Attribute extends mixin(BaseModel) {
  name!: string;
  schemaId!: string;
  type!: AttributeType;
  required!: boolean;

  static get tableName() {
    return 'attribute';
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['name', 'schemaId', 'type', 'required'],
      properties: {
        name: { type: 'string', minLength: 1, maxLength: 32 },
        schemaId: { type: 'string' },
        type: { enum: [...ATTRIBUTE_TYPES] },
        required: { type: 'boolean' }
      }
    };
  }

  static get relationMappings() {
    return {
      schema: {
        relation: Model.BelongsToOneRelation,
        modelClass: Schema,
        join: {
          from: 'attribute.schema_id',
          to: 'schema.id'
        }
      }
    };
  }
}

export type AttributeDTO = Except<Attribute, keyof Model>;
export type CreateAttributeDTO = Except<Attribute, keyof BaseModel>;
