import type { SchemaPermissionDTO } from '$lib/data/models/schema-permission.model';
import type { Except } from 'type-fest';

export type SchemaUserListResponse = Except<SchemaPermissionDTO, 'schema'>[];
