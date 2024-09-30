<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import { Dialog, DialogContent, DialogDescription } from '$lib/components/ui/dialog';
  import DialogTitle from '$lib/components/ui/dialog/dialog-title.svelte';
  import { onMount } from 'svelte';
  import type { AttachedInstance } from '../../../../../api/schema/[id=uuid]/attached-instances/+server.ts';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { CheckIcon, CircleAlertIcon } from 'lucide-svelte';
  import { Alert, AlertDescription } from '$lib/components/ui/alert';
  import AlertTitle from '$lib/components/ui/alert/alert-title.svelte';
  import { Badge } from '$lib/components/ui/badge';

  interface Props {
    isOpen: boolean;
  }

  let { isOpen = $bindable() }: Props = $props();
  let schemaId = $page.params['schema'];

  const fetchAttachedInstances = async () => {
    if (!schemaId) return;

    const ret = await fetch(`/api/schema/${schemaId}/attached-instances`);
    if (ret.ok) {
      const data = (await ret.json()) as AttachedInstance[];
      return data;
    }
    return [];
  };

  const handleDelete = async () => {
    if (!schemaId) return;

    const res = await fetch(`/api/schema/${schemaId}`, { method: 'DELETE' });
    if (res.ok) {
      goto('/authed/schema', { invalidateAll: true });
    }
  };

  let attachedInstances = $state<Promise<AttachedInstance[] | undefined>>();
  onMount(() => {
    attachedInstances = fetchAttachedInstances();
  });
</script>

<Dialog open={isOpen} onOpenChange={(v) => (isOpen = v)}>
  <DialogContent>
    <DialogTitle>Delete Schema</DialogTitle>
    {#await attachedInstances}
      <Skeleton class="w-1/2 h-6"></Skeleton>
      <Skeleton class="w-3/4 h-6"></Skeleton>
      <Skeleton class="w-1/2 h-6"></Skeleton>
      <Skeleton class="w-full h-6"></Skeleton>
    {:then instances}
      <DialogDescription
        >Are you sure you want to delete this schema? It will cascade delete all attached instances.</DialogDescription
      >
      <ul class="flex flex-col gap-2">
        {#each instances ?? [] as instance}
          <li class="flex gap-2 rounded-md bg-secondary py-1.5 pl-4 pr-2 text-sm items-center">
            {instance.name}

            {#if instance.permissions.includes('INSTANCE:DELETE')}
              <Badge variant="default" class="py-0 ml-auto">
                <CheckIcon strokeWidth="3" class="w-3 mr-2"></CheckIcon>
                Deletable
              </Badge>
            {:else}
              <Badge variant="destructive" class="py-0 ml-auto">
                <CheckIcon strokeWidth="3" class="w-3 mr-2"></CheckIcon>
                Not Deletable
              </Badge>
            {/if}
          </li>
        {/each}
      </ul>

      {#if instances === undefined || instances.every( (i) => i.permissions.includes('INSTANCE:DELETE') )}
        <Button variant="destructive" onclick={handleDelete}>Delete</Button>
      {:else}
        <Alert variant="default">
          <CircleAlertIcon class="w-4"></CircleAlertIcon>
          <AlertTitle>Insufficient Permissions</AlertTitle>
          <AlertDescription
            >There are attached instances that cannot be deleted. Contact the adminstrators of that
            instance to delete it.</AlertDescription
          >
        </Alert>
      {/if}
    {:catch error}
      <p class="text-secondary-foreground text-sm">{error}</p>
    {/await}
  </DialogContent>
</Dialog>
