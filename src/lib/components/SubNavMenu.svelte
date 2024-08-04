<script context="module" lang="ts">
  export type Route = { id: string; name: string; icon?: ComponentType<Icon> };
</script>

<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/ui/button/button.svelte';
  import { Icon } from 'lucide-svelte';
  import type { ComponentType } from 'svelte';
  export let routes: Route[];
  export let rootUri: string;

  $: rootUri = rootUri.endsWith('/') ? rootUri : rootUri + '/';
  // Checks if rootUri + uri is a prefix of the current URI
  function checkIsPrefix(uri: string): boolean {
    if (uri === '#separator' || uri === '#label') {
      return false;
    }

    return $page.url.pathname.startsWith(rootUri + uri);
  }

  let activeUrl: string;
  const update = (_p) => routes.filter((r) => checkIsPrefix(r.id))[0] ?? routes[0];
  $: activeUrl = update($page)?.id ?? '';
</script>

<div class="md:flex h-full w-full flex-col items-stretch gap-2.5 hidden">
  {#each routes as { id, name, icon }}
    {#if id === '#separator'}
      <hr class="mb-2" />
    {:else if id === '#label'}
      <p class="ml-3 text-sm text-muted-foreground">{name}</p>
    {:else}
      <Button
        href={rootUri + id}
        variant={activeUrl === id ? 'secondary' : 'ghost'}
        class="justify-start text-start"
      >
        {#if icon}
          <svelte:component this={icon} class="w-5 mr-3"></svelte:component>
        {:else}
          <span class="w-8"></span>
        {/if}
        {name}</Button
      >
    {/if}
  {/each}
</div>
<div class="flex h-full w-full flex-col items-stretch gap-2.5 md:hidden">
  {#each routes as { id, name, icon }}
    {#if id === '#separator'}
      <hr class="mb-2" />
    {:else if id === '#label'}
      <p class="ml-3 text-sm text-muted-foreground">{name}</p>
    {:else}
      <Button
        href={rootUri + id}
        variant={activeUrl === id ? 'secondary' : 'ghost'}
        class="justify-start text-start"
      >
        {#if icon}
          <svelte:component this={icon} class="w-5 mr-3"></svelte:component>
        {:else}
          <span class="w-8"></span>
        {/if}
        {name}</Button
      >
    {/if}
  {/each}
</div>
