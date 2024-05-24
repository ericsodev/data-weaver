import type { Knex } from 'knex';
import type { UserDTO } from '../../src/lib/data/models/userModel';
import { convertCamelToSnakeKeys } from '../../src/lib/utils/camelToSnake';
import { sha256 } from 'js-sha256';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('user').del();

  // Inserts seed entries
  await knex<UserDTO>('user').insert(
    convertCamelToSnakeKeys({
      id: '27f48988-1995-48a5-8e5e-90acc0f369e1',
      name: 'john',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userRole: 'admin',
      passwordHash: sha256('johndoe')
    })
  );
}
