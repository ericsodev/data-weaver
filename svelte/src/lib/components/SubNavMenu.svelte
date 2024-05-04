<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/ui/button/button.svelte';
  type Route = { id: string; name: string };
  export let routes: Route[];
  export let rootUri: string;

  $: rootUri = rootUri.endsWith('/') ? rootUri : rootUri + '/';
  // Checks if rootUri + uri is a prefix of the current URI
  function checkIsPrefix(uri: string): boolean {
    const re = /\/*([^/]*)/;
    const uriMatch = uri.match(re);
    if (!uriMatch) return false;

    uri = uriMatch[1];

    return $page.url.pathname.startsWith(rootUri + uri);
  }

  let activeUrl: string;
  const update = (p) => routes.map((r) => r.id).filter(checkIsPrefix)[0] ?? routes[0].id;
  $: activeUrl = update($page);
</script>

<div class="flex h-full w-full flex-col items-stretch gap-2.5">
  {#each routes as { id, name }}
    {#if id === '#separator'}
      <hr class="mb-2" />
    {:else if id === '#label'}
      <p class="ml-3 text-sm text-muted-foreground">{name}</p>
    {:else}
      <Button
        href={rootUri + id}
        variant={activeUrl === id ? 'secondary' : 'ghost'}
        class="justify-start text-start">{name}</Button
      >
    {/if}
  {/each}
</div>
