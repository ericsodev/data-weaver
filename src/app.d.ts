// See https://kit.svelte.dev/docs/types#app

import type { SystemAbility } from '$lib/auth/roles/system-permissions';
import type { User } from '$lib/data/models/user.model';

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user?: Pick<User, 'id' | 'name' | 'roles'> & { abilities: SystemAbility[] };
    }
    //interface PageData {
    //	session?: Session;
    //}
    interface PageState {
      showModal?: boolean;
      userId?: string;
    }
    // interface Platform {}
  }
}

export {};
