import { z } from 'zod';
import { ATTRIBUTE_TYPES } from '$lib/data/models/attribute.types';
import { SCHEMA_TYPES } from '$lib/data/models/schema.types';

export const attributePostValidation = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  type: z.enum(ATTRIBUTE_TYPES),
  required: z.boolean()
});

export const attributePutValidation = attributePostValidation
  .extend({
    delete: z.boolean().optional()
  })
  .refine((data) => !(data.id === undefined && data.delete === true), {
    message: 'Cannot delete an entry that has not been inserted.'
  });

export const schemaPostValidation = z.object({
  name: z.string().min(1),
  schemaType: z.enum(Object.values(SCHEMA_TYPES) as [string, ...string[]]).optional()
});

export const schemaPutValidation = schemaPostValidation
  .partial()
  .extend({
    attributes: z.array(attributePutValidation).optional()
  })
  .partial();

export type SchemaPostPayload = z.infer<typeof schemaPostValidation>;
export type SchemaPutPayload = z.infer<typeof schemaPutValidation>;
export type AttributePostPayload = z.infer<typeof attributePostValidation>;
export type AttributePutPayload = z.infer<typeof attributePutValidation>;
