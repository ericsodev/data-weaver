import type { AttributeValue } from '$lib/data/models/attribute.types';
import type { AttributeDTO } from '$lib/data/models/attributeModel';

export type FormData = Record<string, { value: AttributeValue; schema: AttributeDTO }>;
