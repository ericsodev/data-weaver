<script lang="ts">
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { TableRow, TableCell } from '$lib/components/ui/table';
  import { USER_ROLES } from '$lib/data/models/role.model';
  import dayjs from 'dayjs';
  import type { User } from './types';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { SaveIcon } from 'lucide-svelte';
  import SaveConfirmationPrompt from './SaveConfirmationPrompt.svelte';

  interface IProps {
    user: User;
    newState: User;
    readonly: boolean;
  }

  let { user, newState = $bindable(), readonly }: IProps = $props();

  let assignedRoles = $derived(
    Object.entries(newState.roles)
      .filter((role) => role[1])
      .map((role) => role[0])
  );

  let hasChanged = $derived.by(() => {
    const roles = new Set([...Object.keys(user.roles), ...Object.keys(newState.roles)]);

    for (const role of roles) {
      if (!!user.roles[role as USER_ROLES] !== !!newState.roles[role as USER_ROLES]) {
        return true;
      }
    }
    return false;
  });
</script>

<TableRow class="group">
  <TableCell>
    {user.name}
  </TableCell>
  <TableCell>{dayjs(user.createdAt).format('MMMM DD, YYYY')}</TableCell>
  <TableCell class="flex items-center gap-4">
    {#if !readonly}
      <DropdownMenu.Root closeOnItemClick={false}>
        <DropdownMenu.Trigger asChild let:builder>
          <Button builders={[builder]} size="sm" variant="ghost">Assign</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="w-56">
          <DropdownMenu.Label>Roles</DropdownMenu.Label>
          <DropdownMenu.Separator />
          {#each Object.keys(newState.roles) as role}
            <DropdownMenu.CheckboxItem
              bind:checked={newState.roles[role as USER_ROLES]}
              disabled={role === USER_ROLES.OWNER}
            >
              {role}
            </DropdownMenu.CheckboxItem>
          {/each}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    {/if}
    <div class="flex flex-wrap items-center gap-1 w-72">
      {#each assignedRoles as role}
        <Badge>{role}</Badge>
      {/each}
    </div>
    <div class="ml-auto flex items-center gap-1">
      {#if hasChanged}
        <SaveConfirmationPrompt
          userId={user.id}
          userName={user.name}
          existingRoles={Object.keys(user.roles).filter(
            (role) => !!user.roles[role as USER_ROLES]
          ) as USER_ROLES[]}
          assignedRoles={Object.keys(newState.roles).filter(
            (role) => !!newState.roles[role as USER_ROLES]
          ) as USER_ROLES[]}
        >
          <Button size="sm" variant="outline" class="m-0"
            ><SaveIcon class="w-3.5 mr-1.5"></SaveIcon> Save</Button
          >
        </SaveConfirmationPrompt>
        <Button
          size="sm"
          variant="ghost"
          class="m-0"
          onclick={() => (newState.roles = $state.snapshot(user.roles))}>Cancel</Button
        >
      {/if}
    </div>
  </TableCell>
</TableRow>
