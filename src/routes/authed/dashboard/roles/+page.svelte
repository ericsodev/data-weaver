<script lang="ts">
  import { Table, TableBody, TableHead, TableHeader, TableRow } from '$lib/components/ui/table';
  import type { User, SelectedRoles } from './types';
  import UserTableRow from './UserTableRow.svelte';

  let { data } = $props();

  // Users is the initial user data
  let users: User[] = $derived(
    structuredClone(data.users).map((user) => {
      let roles = Object.values(data.roles).reduce((acc: SelectedRoles, curr) => {
        acc[curr] = user.roles.filter((role) => role.name === curr).length !== 0;
        return acc;
      }, {});

      return { ...user, roles };
    })
  );
  //
  let formData = $state<User[]>(
    data.users.map((user) => {
      let roles = Object.values(data.roles).reduce((acc: SelectedRoles, curr) => {
        acc[curr] = user.roles.filter((role) => role.name === curr).length !== 0;
        return acc;
      }, {});

      return { ...user, roles };
    })
  );
</script>

<h2 class="scroll-m-20 mb-4 pb-2 text-3xl font-semibold tracking-tight first:mt-0">User Roles</h2>
<Table>
  <TableHeader>
    <TableRow>
      <TableHead class="w-28 md:w-48">Username</TableHead>
      <TableHead>Join Date</TableHead>
      <TableHead>Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {#each users as user, i}
      <UserTableRow
        readonly={!data.user.abilities.includes('USER:MANAGE')}
        {user}
        bind:newState={formData[i] as User}
      ></UserTableRow>
    {/each}
  </TableBody>
</Table>
