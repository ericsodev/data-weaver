<script lang="ts">
  import * as Table from '$lib/components/ui/table/';
  import * as Alert from '$lib/components/ui/alert';
  import Button from '$lib/components/ui/button/button.svelte';
  import AttributeRow from './AttributeRow.svelte';

  let { data } = $props();
  const onSave = () => {};
  const error = $state();
  let hasChanges = $state(false);
  console.log(data.instance);
</script>

<header class="mb-8 flex justify-between">
  <span>
    <p class="text-xl text-muted-foreground">Instance</p>
    <h2 class="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
      {data.instance.name}
    </h2>
  </span>
  <!-- {#if canDelete} -->
  <!--   <Button onclick={handleDelete} size="sm" variant="outline" class="self-end" -->
  <!--     ><Trash2 class="w-4 mr-2"></Trash2> Delete</Button -->
  <!--   > -->
  <!-- {/if} -->
</header>
<div>
  <Table.Root class="w-full">
    <Table.Header>
      <Table.Row>
        <Table.Head class="min-w-[120px] w-60">Name</Table.Head>
        <Table.Head class="min-w-[120px] w-60">Type</Table.Head>
        <Table.Head class="w-80">Value</Table.Head>
        <Table.Head class="w-20">Reset</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each data.instance.schema?.attributes ?? [] as attribute}
        <AttributeRow {attribute}></AttributeRow>
      {/each}
    </Table.Body>
  </Table.Root>
  {#if data.abilities.includes('ATTRIBUTE:WRITE') && hasChanges}
    <Button on:click={onSave} size="lg" class="mt-6">Save changes</Button>
  {/if}
  {#if error}
    <Alert.Root class="w-60 bg-red-400/30 border-red-500 border-[1.5px] fixed top-10 right-10">
      <Alert.Title>Error saving</Alert.Title>
      <Alert.Description>{error}</Alert.Description>
    </Alert.Root>
  {/if}
</div>
