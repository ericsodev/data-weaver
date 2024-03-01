<script lang="ts">
  import * as Form from '$lib/components/ui/form';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { loginFormSchema } from './schema';

  export let data: SuperValidated<Infer<typeof loginFormSchema>>;

  const form = superForm(data, {
    validators: zodClient(loginFormSchema)
  });

  const { form: formData, enhance } = form;
</script>

<div class="flex h-full w-full flex-col items-center justify-start gap-5">
  <section class="flex basis-1/3 items-center justify-center">
    <h1 class=" scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Login</h1>
  </section>
  <Card.Root class="w-[350px]">
    <Card.Header>
      <Card.Title>Login</Card.Title>
    </Card.Header>
    <Card.Content>
      <form use:enhance method="post">
        <Form.Field {form} name="username">
          <Form.Control let:attrs>
            <Form.Label>Username</Form.Label>
            <Input {...attrs} bind:value={$formData.username} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="password">
          <Form.Control let:attrs>
            <Form.Label>Password</Form.Label>
            <Input {...attrs} type="password" bind:value={$formData.password} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Button variant="outline" class="w-full">Login</Form.Button>
      </form>
    </Card.Content>
    <Card.Footer>
      <Button variant="ghost" class="mx-auto" href="/register">Register instead</Button>
    </Card.Footer>
  </Card.Root>
</div>
