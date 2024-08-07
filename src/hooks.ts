import type { Reroute } from '@sveltejs/kit';

const translated: Record<string, string> = {
  '/dashboard/overview': '/dashboard'
};

export const reroute: Reroute = ({ url }) => {
  console.log('hi');
  if (url.pathname in translated) {
    return translated[url.pathname];
  }
};
