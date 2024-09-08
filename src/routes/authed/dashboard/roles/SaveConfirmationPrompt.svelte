<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import type { USER_ROLES } from '$lib/data/models/role.model';
  import { AsteriskIcon, MinusIcon, PlusIcon } from 'lucide-svelte';
  import type { Snippet } from 'svelte';

  interface IProps {
    children: Snippet;
    userName: string;
    userId: string;
    assignedRoles: USER_ROLES[];
    existingRoles: USER_ROLES[];
  }

  let { children, userId, userName, assignedRoles, existingRoles }: IProps = $props();

  let addedRoles = $derived(assignedRoles.filter((role) => !existingRoles.includes(role)));
  let removedRoles = $derived(existingRoles.filter((role) => !assignedRoles.includes(role)));
  let unchangedRoles = $derived(assignedRoles.filter((role) => existingRoles.includes(role)));

  let dialogOpen = $state(false);
  let formState = $state<'submitting' | 'done' | 'none'>('none');

  async function handleSubmit() {
    formState = 'submitting';
    try {
      await fetch(`/api/user/id/${userId}/roles`, {
        method: 'PUT',
        body: JSON.stringify({
          roles: assignedRoles
        })
      });
      await invalidate('user:roles');
      dialogOpen = false;
    } catch (error) {
      console.log('Error', error);
    }
    formState = 'done';
  }
</script>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Trigger>
    {@render children()}
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Modify roles for {userName}</Dialog.Title>
    <Dialog.Description>Confirm you want to make these changes.</Dialog.Description>
    {#if unchangedRoles.length > 0}
      <p>Unchanged Roles</p>
      <ul class="flex flex-col gap-1">
        {#each unchangedRoles as role}
          <li class="text-sm flex items-center gap-2 bg-slate-300/50 px-1.5 py-0.5 rounded-md">
            <AsteriskIcon class="w-3" />
            {role}
          </li>
        {/each}
      </ul>
    {/if}
    {#if addedRoles.length > 0}
      <p>Roles to Assign</p>
      <ul class="flex flex-col gap-1">
        {#each addedRoles as role}
          <li class="text-sm flex items-center gap-2 bg-green-300/50 px-1.5 py-0.5 rounded-md">
            <PlusIcon class="w-3" />
            {role}
          </li>
        {/each}
      </ul>
    {/if}
    {#if removedRoles.length > 0}
      <p>Roles to Unassign</p>
      <ul class="flex flex-col gap-1">
        {#each removedRoles as role}
          <li class="text-sm flex items-center gap-2 bg-red-300/50 px-1.5 py-0.5 rounded-md">
            <MinusIcon class="w-3" />
            {role}
          </li>
        {/each}
      </ul>
    {/if}
    <div class="flex gap-2">
      <Button onclick={handleSubmit} disabled={formState === 'submitting'}>Confirm</Button>
      <Button
        variant="outline"
        onclick={() => (dialogOpen = false)}
        disabled={formState === 'submitting'}>Cancel</Button
      >
    </div>
  </Dialog.Content>
</Dialog.Root>
