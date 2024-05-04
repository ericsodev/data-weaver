<script>
  import { page } from '$app/stores';
  import Button from '$lib/components/ui/button/button.svelte';
  import '$lib/fonts/stylesheet.css';
  import '../app.pcss';
</script>

{#if $page.data.session}
  <nav
    class="fixed left-0 right-0 top-0 flex items-center justify-between gap-6 px-3 py-2 md:justify-end"
  >
    <span class="text-sm text-muted-foreground"
      >Logged in as <strong class="font-medium">{$page.data.session.username}</strong></span
    >
    <form method="POST" action="/?/logout">
      <Button variant="outline" type="submit" class="ml-auto block">Logout</Button>
    </form>
  </nav>
{/if}

<slot />
