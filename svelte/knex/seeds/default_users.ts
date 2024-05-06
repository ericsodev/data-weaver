import { Knex } from 'knex';
import { sha256 } from 'js-sha256';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('user').del();

  // Inserts seed entries
  await knex('user').insert([
    { name: 'admin', password_hash: sha256('admin'), is_admin: true },
    { name: 'user', password_hash: sha256('password') }
  ]);
}
