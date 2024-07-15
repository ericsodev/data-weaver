<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import CreateInstanceForm from './CreateInstanceForm.svelte';
  import { buttonVariants } from '$lib/components/ui/button';
  let { data } = $props();
</script>

<Dialog.Root>
  <Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>New instance</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header class="pb-4">
      <Dialog.Title>Create new instance</Dialog.Title>
    </Dialog.Header>
    <CreateInstanceForm schemas={data.schemas} formData={data.formData}></CreateInstanceForm>
  </Dialog.Content>
</Dialog.Root>
