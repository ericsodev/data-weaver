import { writable } from 'svelte/store';
import Cookie from 'js-cookie';
import { z } from 'zod';

const sessionSchema = z.object({ session_id: z.string(), username: z.string() });
export interface AuthSession {
  logged_in: boolean;
  session?: z.infer<typeof sessionSchema>;
}

function placeholderAsyncLogin(
  username: string,
  password: string
): Promise<Pick<AuthSession, 'session'>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        resolve({ session: { session_id: '123', username: 'admin' } });
      } else {
        reject('Invalid username or password');
      }
    }, 200);
  });
}

function sessionFromCookie(): AuthSession {
  let session: AuthSession = { logged_in: false };
  const cookie = Cookie.get('data-weaver-session');
  if (cookie) {
    const s = sessionSchema.safeParse(JSON.parse(cookie));
    if (s.success) {
      session = { logged_in: true, session: s.data };
    }
  }
  return session;
}

function createAuthStore() {
  // TODO: Check if the session is still valid

  const { set, subscribe } = writable<AuthSession>(sessionFromCookie());
  return {
    subscribe,
    logout: () => {
      Cookie.remove('data-weaver-session');
      set({ logged_in: false });
    },
    login: async ({ username, password }: { username: string; password: string }) => {
      placeholderAsyncLogin(username, password).then((session) => {
        Cookie.set('data-weaver-session', JSON.stringify(session.session));
        set({ logged_in: true, session: session.session });
      });
    },
    refresh: () => set(sessionFromCookie())
  };
}

const authStore = createAuthStore();
export default authStore;
