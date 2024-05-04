<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import SettingsMenu from '$lib/components/SubNavMenu.svelte';
  import '$lib/styles/mainLayout.css';
  const routes = [
    { id: 'overview', name: 'Overview' },
    { id: 'users', name: 'Users' },
    { id: 'roles', name: 'Roles' },
    { id: 'permissions', name: 'Permissions' },
    { id: 'webhooks', name: 'Webhooks' },
    { id: 'database', name: 'Database' }
  ];
</script>

<div class="layout h-full px-12">
  <header class="header">
    <h2 class="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
      Instances
    </h2>
  </header>
  <section class="sidebar">
    <SettingsMenu {routes} rootUri="/instances/" />
  </section>
  <section class="subnav flex gap-2">
    <Button href="/schema" variant="ghost" class="w-28 text-muted-foreground">Schema</Button>
    <Button href="/dashboard" variant="ghost" class="w-28 text-muted-foreground">Dashboard</Button>
  </section>
  <section class="main"></section>
</div>
