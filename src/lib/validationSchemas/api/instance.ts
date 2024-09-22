import { z } from 'zod';
export const instancePostValidation = z.object({
  name: z.string(),
  schemaId: z.string().uuid(),
  description: z.string().max(150),
  userId: z.string().uuid()
});

export const instanceCreateFormValidation = z.object({
  name: z.string(),
  description: z.string().max(150),
  schemaId: z.string({ message: 'A schema is required' }).uuid({ message: 'Invalid schema' })
});

export type InstancePostPayload = z.infer<typeof instancePostValidation>;
export type InstanceCreateForm = z.infer<typeof instanceCreateFormValidation>;
