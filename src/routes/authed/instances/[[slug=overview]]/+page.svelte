<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import CreateInstanceForm from './CreateInstanceForm.svelte';
  import Card from '$lib/components/ui/card/card.svelte';
  import CardContent from '$lib/components/ui/card/card-content.svelte';
  import { PlusCircle } from 'lucide-svelte';
  import { pushState } from '$app/navigation';
  import { page } from '$app/stores';
  import InstanceCard from './InstanceCard.svelte';
  import Alert from '$lib/components/ui/alert/alert.svelte';

  let { data } = $props();

  function showModal() {
    pushState('', { showModal: true });
  }

  function closeModal() {
    pushState('', { showModal: false });
  }

  let modalOpen = $derived($page.state.showModal);
</script>

<h2 class="scroll-m-20 mb-4 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Instances</h2>
<div class="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-4 auto-rows-fr">
  {#each data.instances as instance}
    <InstanceCard {instance}></InstanceCard>{/each}

  {#if data.user.abilities.includes('INSTANCE:CREATE')}
    <Card class="hover:bg-secondary transition-colors cursor-pointer min-h-36" onclick={showModal}>
      <CardContent class="p-0 flex items-center justify-center h-full">
        <PlusCircle class="w-5 mr-3"></PlusCircle>
        New Instance</CardContent
      >
    </Card>
  {:else if data.instances.length === 0}
    <Alert>No instances found</Alert>
  {/if}
</div>

<Dialog.Root open={modalOpen} onOpenChange={(value) => !value && closeModal()}>
  <Dialog.Content>
    <Dialog.Header class="pb-4">
      <Dialog.Title>Create new instance</Dialog.Title>
    </Dialog.Header>
    <CreateInstanceForm schemas={data.schemas} formData={data.formData}></CreateInstanceForm>
  </Dialog.Content>
</Dialog.Root>
