import type { AttributeDTO } from '$lib/data/models/attributeModel';
import { z } from 'zod';

export function validatorBuilder(schema: Pick<AttributeDTO, 'name' | 'type' | 'required'>[]) {
  const obj: Record<string, z.ZodTypeAny> = {};
  for (const attr of schema) {
    if (attr.type === 'number') {
      obj[attr.name] = z.number();
    } else if (attr.type === 'string') {
      obj[attr.name] = z.string();
    } else if (attr.type === 'boolean') {
      obj[attr.name] = z.boolean();
    }

    if (!attr.required) {
      obj[attr.name] = obj[attr.name].nullish();
    }
  }

  return z.object(obj);
}
