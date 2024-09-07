import { USER_ROLES } from '$lib/data/models/role.model';
import { z } from 'zod';

export const updateUserRoleSchema = z.object({
  roles: z.array(z.nativeEnum(USER_ROLES))
});
