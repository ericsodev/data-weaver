<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
  } from '$lib/components/ui/select';
  import type { SchemaDTO } from '$lib/data/models/schema.model';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { instanceCreateFormValidation } from '$lib/validationSchemas/api/instance';
  import FormField from '$lib/components/ui/form/form-field.svelte';
  import { FormControl, FormDescription, FormLabel } from '$lib/components/ui/form';
  import FormFieldErrors from '$lib/components/ui/form/form-field-errors.svelte';

  interface IProps {
    schemas: SchemaDTO[];
    formData: SuperValidated<Infer<typeof instanceCreateFormValidation>>;
  }

  let { schemas, formData: data }: IProps = $props();
  const form = superForm(data, {
    validators: zodClient(instanceCreateFormValidation)
  });

  let selectedSchema = $derived(
    schemas
      .filter(({ id }) => id === $formData.schemaId)
      .map((schema) => {
        return { value: schema.id, label: schema.name };
      })[0]
  );

  const { form: formData, enhance } = form;
</script>

<section class="flex flex-col gap-4">
  <form use:enhance method="POST" class="flex flex-col gap-4">
    <FormField {form} name="name">
      <FormControl let:attrs>
        <FormLabel>Instance name</FormLabel>
        <Input placeholder="untitled instance" bind:value={$formData.name} {...attrs}></Input>
      </FormControl>
      <FormDescription></FormDescription>
      <FormFieldErrors></FormFieldErrors>
    </FormField>
    <FormField {form} name="schemaId">
      <FormControl let:attrs>
        <input hidden bind:value={$formData.schemaId} name={attrs.name} />
        <FormLabel>Base schema</FormLabel>
        <Select
          required
          selected={selectedSchema}
          onSelectedChange={(id) => {
            if (!id) return;
            $formData.schemaId = id.value as unknown as string;
          }}
        >
          <SelectTrigger {...attrs}>
            <SelectValue placeholder="Select a schema"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            {#each schemas as schema}
              <SelectItem label={schema.name} value={schema.id} />
            {/each}
          </SelectContent>
        </Select>
      </FormControl>
      <FormDescription></FormDescription>
      <FormFieldErrors></FormFieldErrors>
    </FormField>
    <Button type="submit" class="mt-6 w-fit">Create and save</Button>
  </form>
</section>
