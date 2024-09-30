<script lang="ts">
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
  } from '$lib/components/ui/dialog';
  import { page } from '$app/stores';
  import { pushState } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import type { UserListResponse } from '$lib/data/api-service/user-api-service';
  import type { PageData } from '../$types';
  import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
  } from '$lib/components/ui/select';
  import type { SchemaUserPutPayload } from '$lib/validation-schemas/api/schema-users';
  import { Label } from '$lib/components/ui/label';
  import { SCHEMA_USER_ROLES } from '$lib/data/models/schema-permission.types';
  import { addSchemaUser } from '$lib/data/api-service/schema-api-service';
  import { Alert } from '$lib/components/ui/alert';

  interface Props {
    userId: string;
    allUsers: UserListResponse;
    schema: PageData['schema'];
  }

  let { schema, allUsers, userId }: Props = $props();
  const formData = $state<SchemaUserPutPayload>({
    userId: '',
    role: 'VIEWER',
    schemaId: schema.id
  });

  let formError = $state('');

  const selectedUser = $derived.by(() => {
    const user = allUsers.find((user) => user.id === formData.userId);
    if (!user) return;

    return { value: user.id, label: user.name };
  });

  function setModalOpen(isOpen: boolean) {
    pushState('', { showModal: isOpen });
  }

  async function submitForm() {
    try {
      await addSchemaUser(formData);
      setModalOpen(false);
    } catch (error) {
      console.log(error);
      formError = (error as Error).message;
    }
  }
</script>

<Button variant="outline" class="px-10" onclick={() => setModalOpen(true)}>Add User</Button>
<Dialog open={$page.state.showModal} onOpenChange={(open) => setModalOpen(open)}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Assign User</DialogTitle>
    </DialogHeader>
    <DialogDescription
      >Add User to <strong class="text-secondary-foreground font-medium">{schema.name}</strong
      ></DialogDescription
    >
    <Label>User</Label>
    <Select
      name="user"
      required
      selected={selectedUser}
      onSelectedChange={(id) => {
        formData.userId = id?.value ?? '';
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a user"></SelectValue>
      </SelectTrigger>
      <SelectContent>
        {#each allUsers.filter((u) => u.id !== userId) as user}
          <SelectItem label={user.name} value={user.id} />
        {/each}
      </SelectContent>
    </Select>
    <Label>Role</Label>
    <Select
      name="role"
      required
      selected={{ value: formData.role, label: formData.role }}
      onSelectedChange={(id) => {
        formData.role = id?.value ?? 'VIEWER';
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a role"></SelectValue>
      </SelectTrigger>
      <SelectContent>
        {#each SCHEMA_USER_ROLES.filter((r: string) => r !== 'OWNER') as role}
          <SelectItem label={role} value={role} />
        {/each}
      </SelectContent>
    </Select>
    <div class="flex gap-2 mt-4">
      <Button onclick={() => submitForm()} size="sm" class="px-6">Save</Button>
      <Button onclick={() => setModalOpen(false)} variant="outline" size="sm" class="px-6"
        >Cancel</Button
      >
    </div>
    {#if formError}
      <Alert variant="destructive">{formError}</Alert>
    {/if}
  </DialogContent>
</Dialog>
