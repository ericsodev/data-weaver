<script lang="ts">
  import * as Table from '$lib/components/ui/table/';
  import * as Alert from '$lib/components/ui/alert';
  import Button from '$lib/components/ui/button/button.svelte';
  import AttributeRow from './AttributeRow.svelte';
  import type { AttributeValue } from '$lib/data/models/attribute.types';
  import type { FormData } from './types';
  import { onMount } from 'svelte';
  import { getErrorMessageFromPath, validatorBuilder } from '$lib/utils/validator-builder';
  import { fromError } from 'zod-validation-error';

  let { data } = $props();
  let form = $state<FormData>({});

  function isEmpty(value: AttributeValue | undefined): boolean {
    if (typeof value === 'string' && value === '') return true;

    return value === undefined || value === null;
  }

  function getModifiedFields(
    original: Record<string, AttributeValue>,
    form: FormData
  ): Record<string, boolean> {
    const ret: Record<string, boolean> = {};
    for (const key in form) {
      if (isEmpty(original[key]) && isEmpty(form[key]?.value)) {
        ret[key] = false;
        continue;
      }
      ret[key] = original[key] !== form[key]?.value;
    }

    return ret;
  }

  function getFormData(form: FormData): Record<string, AttributeValue> {
    const ret: Record<string, AttributeValue> = {};
    for (const attr in form) {
      ret[attr] = form[attr]?.value ?? null;
    }

    return ret;
  }

  let validator = validatorBuilder(data.instance.schema?.attributes ?? []);
  const validatedInput = $derived(validator.safeParse(getFormData(form)));

  const onSave = async () => {
    const ret = await fetch(`/api/instance/${data.instance.id}`, {
      method: 'PUT',
      body: JSON.stringify(validatedInput.data)
    });

    console.log(ret);
  };

  const formError = $derived(
    validatedInput.success ? undefined : fromError(validatedInput.error).message
  );
  const saveError = $state();

  let modified = $derived(getModifiedFields(data.instance.attributes, $state.snapshot(form)));
  let hasChanges = $derived(Object.values(modified).some((v) => v));

  onMount(() => {
    for (const attribute of data.instance.schema?.attributes ?? []) {
      form[attribute.name] = {
        value: data.instance.attributes[attribute.name] ?? null,
        schema: attribute
      };
    }
  });
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
<div class="flex flex-col gap-4 items-start">
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
      {#each Object.entries(form) as [name, attribute]}
        <AttributeRow
          error={validatedInput.error && getErrorMessageFromPath(validatedInput.error, name)}
          schema={attribute.schema}
          bind:value={attribute.value}
          modified={modified[attribute.schema.name]}
          reset={() => (attribute.value = data.instance.attributes[name] ?? null)}
        ></AttributeRow>
      {/each}
    </Table.Body>
  </Table.Root>
  {#if data.abilities.includes('ATTRIBUTE:WRITE')}
    <Button
      on:click={onSave}
      size="lg"
      class="mt-6"
      disabled={!hasChanges || !validatedInput.success}>Save changes</Button
    >
  {/if}
  {#if saveError}
    <Alert.Root class="w-60 bg-red-400/30 border-red-500 border-[1.5px] fixed top-10 right-10">
      <Alert.Title>Error saving</Alert.Title>
      <Alert.Description>{saveError}</Alert.Description>
    </Alert.Root>
  {/if}
  {#if formError}
    <Alert.Root class="bg-red-400/30 w-fit">
      <Alert.Title>Form error</Alert.Title>
      <Alert.Description>{formError}</Alert.Description>
    </Alert.Root>
  {/if}
</div>
