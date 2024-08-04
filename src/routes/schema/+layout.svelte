<script lang="ts">
  import type { SchemaDTO } from '$lib/data/models/schemaModel';
  import SettingsMenu from '$lib/components/SubNavMenu.svelte';
  import '$lib/styles/mainLayout.css';
  import { GanttChartIcon, KeyRoundIcon, Settings2Icon } from 'lucide-svelte';
  import NavigationBar from '$lib/components/navigation-bar/NavigationBar.svelte';

  export let data;
  const staticRoutes = [
    { id: 'overview', name: 'Overview', icon: GanttChartIcon },
    { id: 'permissions', name: 'Permissions', icon: KeyRoundIcon },
    { id: 'settings', name: 'Settings', icon: Settings2Icon },
    { id: '#separator', name: 'Separator' },
    { id: '#label', name: 'Schemas' }
  ];
  const appendRoutes = (schemas: Pick<SchemaDTO, 'id' | 'name'>[]) => {
    const routes = [...staticRoutes, ...schemas.map((s) => ({ id: 'id/' + s.id, name: s.name }))];
    return routes;
  };
</script>

<div class="layout min-h-full px-12">
  <header class="header">
    <h2 class="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
      Schema
    </h2>
  </header>
  <section class="sidebar">
    <SettingsMenu routes={appendRoutes(data.schemas ?? [])} rootUri="/schema/" />
  </section>
  <NavigationBar></NavigationBar>
  <section class="main">
    <slot />
  </section>
</div>
