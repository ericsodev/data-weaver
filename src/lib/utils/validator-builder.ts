import type { AttributeDTO } from '$lib/data/models/attribute.model';
import { z } from 'zod';
import { fromError, type ZodError } from 'zod-validation-error';

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

    const type = obj[attr.name];
    if (!attr.required && type) {
      obj[attr.name] = type.nullish();
    }
  }

  return z.object(obj);
}

/**
 * Returns the first error message with the given path
 */
export function getErrorMessageFromPath(error: ZodError, path: string): string | undefined {
  const refinedError = fromError(error);
  const ret = refinedError['details'].filter((err) => err.path.includes(path))[0]?.message;
  return ret;
}
