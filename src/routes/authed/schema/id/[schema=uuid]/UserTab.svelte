<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell
  } from '$lib/components/ui/table';
  import type { UserListResponse } from '$lib/validationSchemas/api/schema-users';
  import { Badge, UserMinus } from 'lucide-svelte';
  import { onMount } from 'svelte';

  interface Props {
    schemaId: string;
    currentUserId: string;
  }

  let { schemaId, currentUserId }: Props = $props();

  let currentUsers = $state<UserListResponse>([]);

  async function loadCurrentUsers() {
    const result = await fetch(`/api/schema/${schemaId}/users`);
    currentUsers = await result.json();
  }

  onMount(() => {
    loadCurrentUsers();
  });
</script>

<Table>
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
            <Badge>{'Fake Role'}</Badge>
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
