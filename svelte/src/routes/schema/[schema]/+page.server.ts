import { db } from '$lib/data/actions';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/** @type {import('./$types').PageServerLoad} */
export const load: PageServerLoad = async ({ params }) => {
  // Load a single data schema

  if (!params.schema) {
    error(400, { message: 'Invalid schema path' });
  }

  const s = await db.schema.find({ id: params.schema });
  if (!s) {
    redirect(301, '/schema');
  }
  return { id: s.id, name: s.name };
};
