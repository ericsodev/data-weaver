<script lang="ts">
  import AttributeProperty from './AttributeProperty.svelte';
  import type { SchemaPostPayload } from '$lib/validationSchemas/schemaPost';
  import * as Table from '$lib/components/ui/table';
  import * as Alert from '$lib/components/ui/alert';
  import { Button } from '$lib/components/ui/button';
  import { PlusIcon } from 'lucide-svelte';
  import { createAttributeState } from './AttributeState.svelte';

  let { data } = $props();
  let error = $state('');
  let attributesState = createAttributeState(data.schema.attributes);

  async function onSave() {
    const payload: SchemaPostPayload = {
      name: data.schema.name,
      attributes: attributesState.attributes.map((a) => a.modified)
    };
    try {
      const res = await fetch(`/api/schema/${data.schema.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const body = await res.json();
        error = body.message ?? 'An error occurred';
        setTimeout(() => {
          error = '';
        }, 1500);
      }
    } catch (error: unknown) {
      console.log(error);
    }
  }
</script>

<header class="mb-8">
  <p class="text-xl text-muted-foreground">Schema</p>
  <h2 class="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
    {data.schema.name}
  </h2>
</header>
<div>
  <Table.Root class="w-full">
    <Table.Header>
      <Table.Row>
        <Table.Head class="min-w-[180px] w-80">Name</Table.Head>
        <Table.Head class="min-w-[120px] w-60">Type</Table.Head>
        <Table.Head></Table.Head>
        <Table.Head class="w-20">Required</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each attributesState.attributes as attribute}
        <AttributeProperty
          data={attribute}
          modify={(change) => {
            attribute.modified = { ...attribute.modified, ...change };
            if (change.required !== undefined) {
              attribute.modified.required = change.required;
            }
          }}
        ></AttributeProperty>
      {/each}
      <Table.Row class="hover:bg-transparent">
        <Table.Cell colspan={3}>
          <Button
            size="sm"
            variant="secondary"
            on:click={() => {
              attributesState.addAttribute();
            }}
          >
            <PlusIcon class="w-4 mr-2.5"></PlusIcon>
            New Attribute</Button
          >
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table.Root>
  {#if ['ADMIN', 'WRITE'].includes(data.schema.accessType)}
    <Button on:click={onSave} size="lg" class="mt-6">Save changes</Button>
  {/if}
  {#if error}
    <Alert.Root class="w-60 bg-red-400/30 border-red-500 border-[1.5px] fixed top-10 right-10">
      <Alert.Title>Error saving</Alert.Title>
      <Alert.Description>{error}</Alert.Description>
    </Alert.Root>
  {/if}
</div>
