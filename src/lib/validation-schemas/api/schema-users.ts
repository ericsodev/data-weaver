import { type SchemaPermissionDTO } from '$lib/data/models/schema-permission.model';
import { SCHEMA_USER_ROLES } from '$lib/data/models/schema-permission.types';
import type { Except } from 'type-fest';
import { z } from 'zod';

export const schemaUserPutValidation = z.object({
  schemaId: z.string().uuid(),
  userId: z.string().uuid(),
  role: z.enum(SCHEMA_USER_ROLES).exclude(['OWNER'])
});
export const schemaUserDeleteValidation = z.object({
  schemaId: z.string().uuid(),
  userId: z.string().uuid()
});

export type SchemaUserListResponse = Except<SchemaPermissionDTO, 'schema'>[];
export type SchemaUserPutPayload = z.infer<typeof schemaUserPutValidation>;
export type SchemaUserDeletePayload = z.infer<typeof schemaUserDeleteValidation>;
