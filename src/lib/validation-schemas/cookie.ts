import { z } from 'zod';
import { signJwt } from '$lib/utils/jwt';

export const cookieSchema = z.object({
  session_id: z.string(),
  id: z.string()
});

export type SessionType = z.infer<typeof cookieSchema>;

export async function signSession(session: SessionType): Promise<string> {
  return await signJwt(session);
}

declare global {
  type Session = SessionType;
}
