import { z } from 'zod';
export const instancePostValidation = z.object({
  name: z.string(),
  schemaId: z.string().uuid(),
  userId: z.string().uuid()
});

export const instanceCreateFormValidation = z.object({
  name: z.string(),
  schemaId: z.string({ message: 'A schema is required' }).uuid({ message: 'Invalid schema' })
});

export type InstancePostPayload = z.infer<typeof instancePostValidation>;
export type InstanceCreateForm = z.infer<typeof instanceCreateFormValidation>;
