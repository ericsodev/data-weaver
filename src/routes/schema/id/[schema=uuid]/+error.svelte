<script>
  import { page } from '$app/stores';
  import Button from '$lib/components/ui/button/button.svelte';
</script>

<main class="flex h-full flex-col items-center justify-center gap-2">
  <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Error</h1>
  <h2 class="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
    {$page.error?.message}
  </h2>
  <Button href="/schema" class="px-8">Schema overview</Button>
</main>
