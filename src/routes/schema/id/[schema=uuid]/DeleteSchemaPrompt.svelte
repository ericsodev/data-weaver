<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { Dialog, DialogContent } from '$lib/components/ui/dialog';
  import DialogTitle from '$lib/components/ui/dialog/dialog-title.svelte';

  interface Props {
    isOpen: boolean;
  }

  let { isOpen = $bindable() }: Props = $props();
  let schemaId = $page.params['id'];

  const handleDelete = async () => {
    if (!schemaId) return;

    const res = await fetch(`/api/schema/${schemaId}`, { method: 'DELETE' });
    if (res.ok) {
      goto('/schema', { invalidateAll: true });
    }
  };
</script>

<Dialog open={isOpen} onOpenChange={(v) => (isOpen = v)}>
  <DialogContent>
    <DialogTitle>Delete schema</DialogTitle>
  </DialogContent>
</Dialog>
