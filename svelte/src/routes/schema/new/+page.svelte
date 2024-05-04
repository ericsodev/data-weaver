<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { z } from 'zod';

  const formSchema = z.object({
    name: z.string()
  });
  export let data: { form: SuperValidated<Infer<typeof formSchema>> };

  const form = superForm(data.form, {
    validators: zodClient(formSchema)
  });

  const { form: formData, enhance } = form;
</script>

<section class="p-4">
  <form method="POST" use:enhance>
    <Form.Field {form} name="name">
      <Form.Control let:attrs>
        <Form.Label>Schema name</Form.Label>
        <Input {...attrs} bind:value={$formData.name} />
      </Form.Control>
      <Form.Description />
      <Form.FieldErrors />
    </Form.Field>
    <Button type="submit" variant="secondary">Create</Button>
  </form>
</section>
