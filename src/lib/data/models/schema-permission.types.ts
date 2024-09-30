export const SCHEMA_USER_ROLES = ['OWNER', 'ADMIN', 'EDITOR', 'VIEWER'] as const;

export type SchemaUserRole = (typeof SCHEMA_USER_ROLES)[number];
