<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Dialog, DialogContent, DialogDescription } from '$lib/components/ui/dialog';
  import DialogTitle from '$lib/components/ui/dialog/dialog-title.svelte';
  import type { SchemaUserListResponse } from '$lib/validation-schemas/api/schema-users.js';
  import { deleteSchemaUser } from '$lib/data/api-service/schema-api-service.js';
  import type { PageData } from '../$types.js';
  import SchemaUserStore from './SchemaUserStore.js';

  interface Props {
    isOpen: boolean;
    schemaUser: SchemaUserListResponse[number] | undefined;
    schema: PageData['schema'];
  }

  let { isOpen = $bindable(), schema, schemaUser }: Props = $props();

  const handleDelete = async () => {
    if (!schemaUser) return;
    console.log({ schemaId: schema.id, userId: schemaUser.id });
    await deleteSchemaUser({ schemaId: schema.id, userId: schemaUser.userId });
    await SchemaUserStore.refresh(schema.id);
    isOpen = false;
  };
</script>

<Dialog open={isOpen} onOpenChange={(v) => (isOpen = v)}>
  <DialogContent>
    <DialogTitle>Remove User</DialogTitle>
    {#if schemaUser}
      <DialogDescription
        >Are you sure you want to remove <strong class="text-white font-medium"
          >{schemaUser.user.name}</strong
        >
        from <strong class="text-white font-medium">{schema.name}</strong></DialogDescription
      >
      <Button variant="destructive" onclick={handleDelete} disabled={!schemaUser}>Save</Button>
    {/if}
  </DialogContent>
</Dialog>
