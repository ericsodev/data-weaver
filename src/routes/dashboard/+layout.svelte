<script lang="ts">
  import SettingsMenu from '$lib/components/SubNavMenu.svelte';
  import '$lib/styles/mainLayout.css';
  import {
    Database,
    GanttChartIcon,
    UserRoundPenIcon,
    UsersRoundIcon,
    WebhookIcon
  } from 'lucide-svelte';
  import NavigationBar from '$lib/components/navigation-bar/NavigationBar.svelte';
  const routes = [
    { id: 'overview', name: 'Overview', icon: GanttChartIcon },
    { id: 'users', name: 'Users', icon: UsersRoundIcon },
    { id: 'roles', name: 'Roles', icon: UserRoundPenIcon },
    // { id: 'permissions', name: 'Permissions', icon: KeyRoundIcon },
    { id: 'webhooks', name: 'Webhooks', icon: WebhookIcon },
    { id: 'database', name: 'Database', icon: Database }
  ];
</script>

<div class="layout h-full px-12">
  <header class="header">
    <h2 class="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
      Dashboard
    </h2>
  </header>
  <section class="sidebar">
    <SettingsMenu {routes} rootUri="/dashboard/" />
  </section>
  <NavigationBar></NavigationBar>
  <section class="main">
    <slot />
  </section>
</div>
