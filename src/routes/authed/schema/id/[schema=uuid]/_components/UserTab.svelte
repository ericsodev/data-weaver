<script lang="ts">
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell
  } from '$lib/components/ui/table';
  import { listSchemaUsers } from '$lib/data/api-service/schema-api-service';
  import { listUsers, type UserListResponse } from '$lib/data/api-service/user-api-service';
  import type { SchemaUserListResponse } from '$lib/validation-schemas/api/schema-users';
  import { UserMinus } from 'lucide-svelte';
  import { onMount } from 'svelte';

  interface Props {
    schemaId: string;
    currentUserId: string;
  }

  let { schemaId, currentUserId }: Props = $props();

  let currentUsers = $state<SchemaUserListResponse>([]);
  let allUsers = $state<UserListResponse>([]);

  async function loadCurrentUsers() {
    currentUsers = await listSchemaUsers(schemaId);
  }

  onMount(async () => {
    async function loadAllUsers() {
      allUsers = await listUsers();
    }
    await Promise.all([loadCurrentUsers(), loadAllUsers()]);
    console.log($state.snapshot(allUsers));
  });
</script>

<Table class="mb-8">
  <TableHeader>
    <TableRow>
      <TableHead class="w-28 md:w-48">Username</TableHead>
      <TableHead>Role</TableHead>
      <TableHead></TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {#each currentUsers as user}
      <TableRow class="group">
        <TableCell>
          {user.user.name}
        </TableCell>
        <TableCell>
          <div class="flex flex-wrap gap-1">
            <Badge>{user.role}</Badge>
          </div>
        </TableCell>
        <TableCell class="flex">
          {#if currentUserId !== user.id}
            <Button
              class="group-hover:visible group-hover:opacity-100 opacity-0 transition-opacity ml-auto invisible group"
              variant="destructive"
              size="sm"
              onclick={() => {}}
            >
              <UserMinus class="w-4 mr-2"></UserMinus>

              Remove</Button
            >
          {/if}
        </TableCell>
      </TableRow>
    {/each}
  </TableBody>
</Table>
<Button variant="outline" class="px-10">Add User</Button>
