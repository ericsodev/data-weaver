import {
  SCHEMA_USER_ROLES,
  type SchemaPermissionDTO
} from '$lib/data/models/schema-permission.model';
import type { Except } from 'type-fest';
import { z } from 'zod';

export const schemaUserPostValidation = z.object({
  schemaId: z.string().uuid(),
  userId: z.string().uuid(),
  role: z.enum(SCHEMA_USER_ROLES).exclude(['OWNER'])
});
export const schemaUserDeleteValidation = z.object({
  schemaId: z.string().uuid(),
  userId: z.string().uuid()
});

export const schemaUserUpdateValidation = schemaUserPostValidation;

export type SchemaUserListResponse = Except<SchemaPermissionDTO, 'schema'>[];
export type SchemaUserPostPayload = z.infer<typeof schemaUserPostValidation>;
export type SchemaUserUpdatePayload = z.infer<typeof schemaUserUpdateValidation>;
export type SchemaUserDeletePayload = z.infer<typeof schemaUserDeleteValidation>;

/*
 * TODO:  - Endpoints for assigning schema user roles
 *         - Dialog Popup for assigning schema user roles
 *       - Edit existing user's role
 *
 *
 */
