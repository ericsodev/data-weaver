<script lang="ts">
  import AttributeProperty from './AttributeProperty.svelte';
  import { schemaPutValidation, type SchemaPutPayload } from '$lib/validationSchemas/api/schema';
  import * as Table from '$lib/components/ui/table';
  import * as Alert from '$lib/components/ui/alert';
  import { Button } from '$lib/components/ui/button';
  import { PlusIcon, Trash2 } from 'lucide-svelte';
  import { createAttributeState } from './AttributeState.svelte';
  import { invalidateAll } from '$app/navigation';
  import DeleteSchemaPrompt from './DeleteSchemaPrompt.svelte';
  import { untrack } from 'svelte';
  import TabGroup from '$lib/components/tabs/TabGroup.svelte';
  import UserTab from './UserTab.svelte';

  let { data } = $props();
  let error = $state('');
  let attributesState = $derived(untrack(() => createAttributeState(data.schema.attributes)));
  const canDelete = $derived(data.abilities.includes('SCHEMA:DELETE'));
  const canModifyAttributes = $derived(data.abilities.includes('ATTRIBUTE:WRITE'));

  async function onSave() {
    const payload: SchemaPutPayload = {
      name: data.schema.name,
      attributes: attributesState.attributes.map((a) => ({
        name: a.modified.name,
        type: a.modified.type,
        required: a.modified.required,
        id: a.id,
        delete: a.delete
      }))
    };

    const validatedPayload = await schemaPutValidation.safeParseAsync(payload);
    if (validatedPayload.error) {
      error = validatedPayload.error.errors[0]?.message ?? '';
      return;
    }

    try {
      const res = await fetch(`/api/schema/${data.schema.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      invalidateAll();
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

  let openDeletePrompt = $state(false);
</script>

{#snippet userTab()}
  <UserTab></UserTab>
{/snippet}

{#snippet table()}
  <div>
    <Table.Root class="w-full">
      <Table.Header>
        <Table.Row>
          <Table.Head class="min-w-[180px] w-80">Name</Table.Head>
          <Table.Head class="min-w-[120px] w-60">Type</Table.Head>
          <Table.Head class="w-20">Required</Table.Head>
          <Table.Head></Table.Head>
          <Table.Head class="w-20">Delete</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each attributesState.attributes as attribute, index}
          <AttributeProperty
            disabled={!canModifyAttributes}
            data={attribute}
            toggleDelete={() => {
              attributesState.toggleDelete(index);
            }}
            modify={(change) => {
              attributesState.modifyAttribute({ ...change }, index);
            }}
          ></AttributeProperty>
        {/each}
        {#if canModifyAttributes}
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
        {/if}
      </Table.Body>
    </Table.Root>
    {#if data.abilities.includes('ATTRIBUTE:WRITE')}
      <Button on:click={onSave} size="lg" class="mt-6">Save changes</Button>
    {/if}
    {#if error}
      <Alert.Root class="w-60 bg-red-400/30 border-red-500 border-[1.5px] fixed top-10 right-10">
        <Alert.Title>Error saving</Alert.Title>
        <Alert.Description>{error}</Alert.Description>
      </Alert.Root>
    {/if}
  </div>
{/snippet}

<header class="mb-8 flex justify-between">
  <span>
    <p class="text-xl text-muted-foreground">Schema</p>
    <h2 class="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
      {data.schema.name}
    </h2>
  </span>
  {#if canDelete}
    <Button onclick={() => (openDeletePrompt = true)} size="sm" variant="outline" class="self-end"
      ><Trash2 class="w-4 mr-2"></Trash2> Delete</Button
    >
  {/if}
</header>
<TabGroup
  defaultSelected="Default"
  options={[
    { name: 'Table', content: table },
    { name: 'Users', content: userTab }
  ]}
/>

<DeleteSchemaPrompt bind:isOpen={openDeletePrompt}></DeleteSchemaPrompt>
