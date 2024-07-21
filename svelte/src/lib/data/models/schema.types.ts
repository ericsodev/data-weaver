export const SCHEMA_TYPES = {
  single: 'Single',
  collection: 'Collection'
} as const;

export type SchemaType = (typeof SCHEMA_TYPES)[keyof typeof SCHEMA_TYPES];
