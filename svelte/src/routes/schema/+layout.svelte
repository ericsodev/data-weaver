<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import SettingsMenu from '$lib/components/SubNavMenu.svelte';
  import '$lib/styles/mainLayout.css';
  import type { Schema } from '$lib/db/schema.js';

  export let data;
  const staticRoutes = [
    { id: 'overview', name: 'Overview' },
    { id: 'permissions', name: 'Permissions' },
    { id: 'settings', name: 'Settings' },
    { id: '#separator', name: 'Separator' },
    { id: '#label', name: 'Schemas' }
  ];
  const appendRoutes = (schemas: Schema[]) => {
    const routes = [
      ...staticRoutes,
      ...schemas.map((s) => ({ id: `schema_${s.id}`, name: s.name }))
    ];
    return routes;
  };
</script>

<div class="layout h-full px-12">
  <header class="header">
    <h2 class="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
      Schema
    </h2>
  </header>
  <section class="sidebar">
    {#await data.schemas}
      <p>Loading...</p>
    {:then schemas}
      <SettingsMenu routes={appendRoutes(schemas ?? [])} rootUri="/schema/" />
    {/await}
  </section>
  <section class="subnav flex gap-2">
    <Button href="/dashboard" variant="ghost" class="w-28 text-muted-foreground">Dashboard</Button>
    <Button href="/instances" variant="ghost" class="w-28 text-muted-foreground">Instances</Button>
  </section>
  <section class="main">
    <slot />
  </section>
</div>
