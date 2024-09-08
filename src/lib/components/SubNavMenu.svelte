<script module lang="ts">
  export type Route = { id: string; name: string; icon?: typeof ComponentIcon };
</script>

<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Button from '$lib/components/ui/button/button.svelte';
  import { cn } from '$lib/utils';
  import { ChevronDown, ChevronUp, ComponentIcon, LogOut } from 'lucide-svelte';
  import { fade } from 'svelte/transition';

  interface Props {
    routes: Route[];
    rootUri: string;
    userName: string;
  }

  let { routes, rootUri, userName }: Props = $props();

  rootUri = rootUri.endsWith('/') ? rootUri : rootUri + '/';
  // Checks if rootUri + uri is a prefix of the current URI
  function checkIsPrefix(uri: string): boolean {
    if (uri === '#separator' || uri === '#label') {
      return false;
    }

    return $page.url.pathname.startsWith(rootUri + uri);
  }

  const update = () => routes.filter((r) => checkIsPrefix(r.id))[0] ?? routes[0];
  let activeUrl = $derived(update()?.id ?? '');

  const signout = () => {
    fetch('/api/user/logout', { method: 'POST' }).then(() => {
      goto('/', { invalidateAll: true });
    });
  };

  let openMenu = $state(false);
</script>

<div class="md:flex h-full w-full flex-col items-stretch gap-2.5 hidden pb-4">
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
          {@const Icon = icon}
          <Icon class="w-5 mr-3"></Icon>
        {:else}
          <span class="w-8"></span>
        {/if}
        {name}</Button
      >
    {/if}
  {/each}

  <p class="text-muted-foreground mt-auto text-sm text-center">Signed in as: {userName}</p>
  <Button onclick={signout} variant="outline" class="text-center mt-2">
    <LogOut class="w-4 mr-1.5" /> Sign out</Button
  >
</div>
<div class=" md:hidden">
  <Button
    variant="link"
    class={cn('text-muted-foreground mb-2', openMenu && 'text-foreground')}
    on:click={() => (openMenu = !openMenu)}
  >
    <span class="mr-2">
      {#if openMenu}
        <ChevronDown class="w-4"></ChevronDown>
      {:else}
        <ChevronUp class="w-4"></ChevronUp>
      {/if}
    </span>
    Menu</Button
  >
  {#if openMenu}
    <div
      transition:fade={{ delay: 10, duration: 100 }}
      class="flex h-full w-full flex-col items-stretch gap-2.5 rounded-md border-muted-foreground border-[1px] pb-5"
    >
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
              {@const Icon = icon}
              <Icon class="w-5 mr-3"></Icon>
            {:else}
              <span class="w-8"></span>
            {/if}
            {name}</Button
          >
        {/if}
      {/each}

      <Button onclick={signout} variant="outline" class="text-center"
        ><LogOut class="w-4 mr-1.5"></LogOut> Sign out</Button
      >
    </div>
  {/if}
</div>
