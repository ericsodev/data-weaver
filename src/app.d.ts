// See https://kit.svelte.dev/docs/types#app

import type { User } from '$lib/data/models/user.model';

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user?: Pick<User, 'id' | 'name' | 'userRole'>;
    }
    //interface PageData {
    //	session?: Session;
    //}
    interface PageState {
      showModal: boolean;
    }
    // interface Platform {}
  }
}

export {};
