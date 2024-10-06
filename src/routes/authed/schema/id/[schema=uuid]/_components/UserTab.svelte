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
  import { listUsers, type UserListResponse } from '$lib/data/api-service/user-api-service';
  import type { SchemaUserListResponse } from '$lib/validation-schemas/api/schema-users';
  import { UserMinus } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import AddUserDialog from './AddUserDialog.svelte';
  import type { PageData } from '../$types';
  import schemaUserStore from './SchemaUserStore';
  import RemoveUserPrompt from './RemoveUserPrompt.svelte';

  interface Props {
    schema: PageData['schema'];
    currentUserId: string;
  }

  let { schema, currentUserId }: Props = $props();

  let currentUsers = $state<SchemaUserListResponse>([]);
  let allUsers = $state<UserListResponse>([]);

  schemaUserStore.subscribe((v) => (currentUsers = v));

  onMount(async () => {
    async function loadAllUsers() {
      allUsers = await listUsers();
    }
    await Promise.all([schemaUserStore.refresh(schema.id), loadAllUsers()]);
  });

  let deleteUserDialog = $state<{
    isOpen: boolean;
    user: SchemaUserListResponse[number] | undefined;
  }>({
    isOpen: false,
    user: undefined
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
          {#if currentUserId !== user.userId}
            <Button
              class="group-hover:visible group-hover:opacity-100 opacity-0 transition-opacity ml-auto invisible group"
              variant="destructive"
              size="sm"
              onclick={() => {
                deleteUserDialog.user = user;
                deleteUserDialog.isOpen = true;
              }}
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
<AddUserDialog {schema} userId={currentUserId} {allUsers} />
<RemoveUserPrompt bind:isOpen={deleteUserDialog.isOpen} schemaUser={deleteUserDialog.user} {schema}
></RemoveUserPrompt>
