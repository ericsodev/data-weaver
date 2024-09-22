<script lang="ts">
  import { pushState } from '$app/navigation';
  import CardContent from '$lib/components/ui/card/card-content.svelte';
  import Card from '$lib/components/ui/card/card.svelte';
  import { PlusCircle } from 'lucide-svelte';
  import SchemaCard from './SchemaCard.svelte';
  import { page } from '$app/stores';
  import { Dialog, DialogContent } from '$lib/components/ui/dialog';
  import DialogHeader from '$lib/components/ui/dialog/dialog-header.svelte';
  import DialogTitle from '$lib/components/ui/dialog/dialog-title.svelte';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { schemaPostValidation } from '$lib/validationSchemas/api/schema';
  import { Button } from '$lib/components/ui/button';
  import { Alert } from '$lib/components/ui/alert';

  let { data } = $props();

  function showModal() {
    pushState('', { showModal: true });
  }

  function closeModal() {
    pushState('', { showModal: false });
  }

  let modalOpen = $derived($page.state.showModal);

  const form = superForm(data.form, {
    validators: zodClient(schemaPostValidation)
  });

  const { form: formData, enhance, allErrors } = form;
</script>

<h2 class="scroll-m-20 mb-4 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Schemas</h2>
<div class="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-4 auto-rows-fr">
  {#each data.schemas as schema}
    <SchemaCard {schema}></SchemaCard>
  {/each}
  {#if data.user.abilities.includes('SCHEMA:CREATE')}
    <Card class="hover:bg-secondary transition-colors cursor-pointer min-h-36" onclick={showModal}>
      <CardContent class="p-0 flex items-center justify-center h-full">
        <PlusCircle class="w-5 mr-3"></PlusCircle>
        New Schema</CardContent
      >
    </Card>
  {:else if data.schemas.length === 0}
    <Alert>No schemas found</Alert>
  {/if}
</div>

<Dialog open={modalOpen} onOpenChange={(value) => !value && closeModal()}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create Schema</DialogTitle>
    </DialogHeader>

    <form method="POST" use:enhance>
      <Form.Field {form} name="name">
        <Form.Control let:attrs>
          <Form.Label class="text-muted-foreground">Schema name</Form.Label>
          <Input placeholder="New Schema" {...attrs} bind:value={$formData.name} />
        </Form.Control>
        <Form.Description />
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="description">
        <Form.Control let:attrs>
          <Form.Label class="text-muted-foreground">Description</Form.Label>
          <Input {...attrs} bind:value={$formData.description} />
        </Form.Control>
        <Form.Description />
        <Form.FieldErrors />
      </Form.Field>
      <Button type="submit" variant="default" class="mt-4 px-8">Save</Button>
    </form>
    {#if $allErrors.length > 0}
      <Alert class="bg-red-400 text-sm">{$allErrors.map((x) => x.messages).join('\n')}</Alert>
    {/if}
  </DialogContent>
</Dialog>
