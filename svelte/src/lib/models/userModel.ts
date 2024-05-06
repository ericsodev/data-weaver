import { sha256 } from 'js-sha256';
import db from '$lib/db/knex';

export interface User {
  name: string;
  password_hash: string;
  is_admin: boolean;
}

export function findUser(name: string): Promise<User | undefined> {
  return db<User>('user').where({ name }).first();
}

export async function insertUser(
  name: string,
  password: string,
  is_admin: boolean = false
): Promise<Pick<User, 'name'> | undefined> {
  const res = await db<User>('user')
    .insert({ name, password_hash: sha256(password), is_admin }, ['name', 'is_admin'])
    .onConflict()
    .ignore();

  return res.length > 0 ? res[0] : undefined;
}

export async function authenticate(name: string, password: string): Promise<boolean> {
  const res = await db<User>('user').where({ name, password_hash: sha256(password) });

  return res.length > 0;
}
