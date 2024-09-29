import type { RedactedUserDTO } from '../models/user.model';

export type UserListResponse = RedactedUserDTO[];

export async function listUsers(): Promise<UserListResponse> {
  const result = await fetch('/api/users');
  return await result.json();
}
