import type { USER_ROLES } from '$lib/data/models/role.model.js';
import type { UserDTO } from '$lib/data/models/user.model.js';
import type { OverrideProperties } from 'type-fest';

export type SelectedRoles = Partial<Record<USER_ROLES, boolean>>;
export type User = OverrideProperties<UserDTO, { roles: SelectedRoles }>;
