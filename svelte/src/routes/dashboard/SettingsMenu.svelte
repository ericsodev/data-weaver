<script>
  import Button from '$lib/components/ui/button/button.svelte';
  const routes = [
    //{ id: 'overview', name: 'Overview' },
    { id: 'users', name: 'Users' },
    { id: 'roles', name: 'Roles' },
    { id: 'permissions', name: 'Permissions' },
    { id: 'webhooks', name: 'Webhooks' },
    { id: 'database', name: 'Database' }
  ];
</script>

<div class="flex h-full w-full flex-col items-stretch gap-2.5 border-r-2 pr-3">
  <Button variant="secondary" class="justify-start text-start">Overview</Button>
  {#each routes as { name }}
    <Button variant="ghost" class="justify-start text-start">{name}</Button>
  {/each}
</div>
