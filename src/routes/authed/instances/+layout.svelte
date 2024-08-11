<script lang="ts">
  import SettingsMenu from '$lib/components/SubNavMenu.svelte';
  import '$lib/styles/mainLayout.css';
  import type { InstanceDTO } from '$lib/data/models/instance.model.js';
  import { FileText, GanttChart, Settings2Icon, UserRoundPenIcon } from 'lucide-svelte';
  import NavigationBar from '$lib/components/navigation-bar/NavigationBar.svelte';

  let { data, children } = $props();

  const staticRoutes = [
    { id: 'overview', name: 'Overview', icon: GanttChart },
    { id: 'roles', name: 'Roles', icon: UserRoundPenIcon },
    { id: 'settings', name: 'Settings', icon: Settings2Icon },
    { id: '#separator', name: 'Separator' },
    { id: '#label', name: 'Instances' }
  ];

  const appendRoutes = (instances: Pick<InstanceDTO, 'id' | 'name'>[]) => {
    const routes = [
      ...staticRoutes,
      ...instances.map((s) => ({ id: 'id/' + s.id, name: s.name, icon: FileText }))
    ];
    return routes;
  };
</script>

<div class="layout h-full px-12">
  <header class="header">
    <h2 class="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
      Instances
    </h2>
  </header>
  <section class="sidebar">
    <SettingsMenu
      routes={appendRoutes(data.instances)}
      rootUri="/authed/instances/"
      userName={data.user?.name ?? ''}
    />
  </section>
  <NavigationBar></NavigationBar>
  <section class="main">
    {@render children()}
  </section>
</div>
