import { z } from "zod";

export const cookieSchema = z.object({
    session_id: z.string(),
    username: z.string()
})

export type SessionType = z.infer<typeof cookieSchema>;

export function stringifySession(session: SessionType): string {
    return JSON.stringify(session);
}

declare global {
    type Session = SessionType;
}
