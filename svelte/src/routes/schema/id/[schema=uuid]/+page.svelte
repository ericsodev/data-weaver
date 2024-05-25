<script lang="ts">
  import AttributeProperty from './AttributeProperty.svelte';
  import * as Table from '$lib/components/ui/table';
  import { Button } from '$lib/components/ui/button';

  export let data;
  let modifiedAttributes = data.schema.attributes.map(({ name, type, required }) => ({
    name,
    type,
    required
  }));

  const addAttribute = () => {
    modifiedAttributes.push({ name: '', type: 'string', required: false });
    modifiedAttributes = modifiedAttributes;
  };
</script>

<header class="mb-8">
  <p class="text-xl text-muted-foreground">Schema</p>
  <h2 class="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
    {data.schema.name}
  </h2>
</header>
<div>
  <Table.Root class="w-fit">
    <Table.Header>
      <Table.Row>
        <Table.Head class="min-w-[180px] w-80">Name</Table.Head>
        <Table.Head class="min-w-[120px] w-48">Type</Table.Head>
        <Table.Head class="w-20">Required</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each modifiedAttributes as attribute}
        <AttributeProperty data={attribute}></AttributeProperty>
      {/each}
      <Table.Row class="hover:bg-transparent">
        <Table.Cell colspan={3}>
          <Button
            class="px-16 mx-auto inline-block"
            on:click={() => {
              addAttribute();
            }}>New Attribute</Button
          >
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table.Root>
  {#if ['ADMIN', 'WRITE'].includes(data.schema.accessType)}
    <Button class="mt-6">Save changes</Button>
  {/if}
</div>
