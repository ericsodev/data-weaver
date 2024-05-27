import { z } from 'zod';
import { ATTRIBUTE_TYPES } from '$lib/data/models/attributeModel';

export const attributeValidation = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  type: z.enum(ATTRIBUTE_TYPES),
  required: z.boolean()
});

export const schemaValidation = z.object({
  name: z.string().min(1),
  attributes: z.array(attributeValidation)
});

export type SchemaPostPayload = z.infer<typeof schemaValidation>;
export type AttributePostPayload = z.infer<typeof attributeValidation>;
