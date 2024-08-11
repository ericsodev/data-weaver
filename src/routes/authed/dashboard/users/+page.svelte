<script lang="ts">
  import { Badge } from '$lib/components/ui/badge';
  import Button from '$lib/components/ui/button/button.svelte';
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
  } from '$lib/components/ui/table';
  import dayjs from 'dayjs';
  import { UserMinus } from 'lucide-svelte';
  import { invalidate, invalidateAll, pushState } from '$app/navigation';
  import { page } from '$app/stores';
  import { Dialog, DialogContent, DialogHeader } from '$lib/components/ui/dialog';
  import DialogTitle from '$lib/components/ui/dialog/dialog-title.svelte';
  import DialogDescription from '$lib/components/ui/dialog/dialog-description.svelte';

  let { data } = $props();

  let authorizedUsers = $derived(data.users.filter((user) => user.roles.length > 0));
  let pendingUsers = $derived(data.users.filter((user) => user.roles.length === 0));

  function showDeleteModal(id: string) {
    pushState('', { showModal: true, userId: id });
  }

  function hideDeleteModal() {
    pushState('', { showModal: false, userId: '' });
  }

  async function handleDelete(id: string) {
    await fetch(`/api/user/id/${id}`, { method: 'DELETE' });
    hideDeleteModal();

    await invalidateAll();
  }

  const canDelete = data.user.abilities.includes('USER:DELETE');
</script>

<h2 class="scroll-m-20 mb-4 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Users</h2>
<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight mt-12">Active Users</h3>
<Table>
  <TableHeader>
    <TableRow>
      <TableHead class="w-28 md:w-48">Username</TableHead>
      <TableHead>Join Date</TableHead>
      <TableHead>Role</TableHead>
      <TableHead></TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {#each authorizedUsers as user}
      <TableRow class="group">
        <TableCell>
          {user.name}
        </TableCell>
        <TableCell>{dayjs(user.createdAt).format('MMMM DD, YYYY')}</TableCell>
        <TableCell>
          {#each user.roles as role}
            <Badge>{role.name}</Badge>
          {/each}
        </TableCell>
        <TableCell class="flex">
          {#if canDelete && data.user.id !== user.id}
            <Button
              class="group-hover:visible group-hover:opacity-100 opacity-0 transition-opacity ml-auto invisible group"
              variant="destructive"
              size="sm"
              onclick={() => showDeleteModal(user.id)}
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

<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight mt-12">Pending Users</h3>
<Table>
  <TableCaption>Registered users without roles show up here.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead class="w-28 md:w-48">Username</TableHead>
      <TableHead>Join Date</TableHead>
      <TableHead></TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {#each pendingUsers as user}
      <TableRow>
        <TableCell>
          {user.name}
        </TableCell>
        <TableCell>{dayjs(user.createdAt).format('MMMM DD, YYYY')}</TableCell>
        <TableCell class="flex">
          {#if canDelete}
            <Button
              variant="destructive"
              size="sm"
              class="ml-auto"
              onclick={() => showDeleteModal(user.id)}
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

<Dialog open={$page.state.showModal} onOpenChange={(value) => !value && hideDeleteModal()}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Remove User</DialogTitle>
    </DialogHeader>
    <DialogDescription
      >Are you sure you want remove

      <span class="text-foreground font-medium">
        {data.users.filter((u) => u.id === $page.state.userId)[0]?.name}
      </span>? This action cannot be undone.
    </DialogDescription>
    <div class="flex gap-2 mt-4">
      <Button
        onclick={() => $page.state.userId && handleDelete($page.state.userId)}
        variant="destructive"
        size="sm"
        class="px-6">Confirm</Button
      >
      <Button onclick={hideDeleteModal} size="sm" class="px-6">Cancel</Button>
    </div>
  </DialogContent>
</Dialog>
