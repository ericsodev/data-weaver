import { redirect } from '@sveltejs/kit';

export const POST = ({ cookies }) => {
  cookies.delete('data-weaver-session', { path: '/' });

  throw redirect(301, '/');
};
