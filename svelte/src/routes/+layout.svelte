<script>
  import { page } from '$app/stores';
  import Button from '$lib/components/ui/button/button.svelte';
  import '$lib/fonts/stylesheet.css';
  import '../app.pcss';
</script>

{#if $page.data.session}
  <nav class="absolute left-0 right-0 top-0 p-1.5">
    <form method="POST" action="/?/logout">
      <Button variant="outline" type="submit" class="ml-auto block">Logout</Button>
    </form>
  </nav>
{/if}

<slot />
