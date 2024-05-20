import { db } from '$lib/data/actions';
import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async () => {
  try {
    const schemas = await db.schema.findAll({});
    return { schemas: schemas.map(({ id, name }) => ({ id, name })) };
  } catch (error: unknown) {
    return { schemas: [] };
  }
};
