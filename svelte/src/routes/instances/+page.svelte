<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import SettingsMenu from './SettingsMenu.svelte';
  import './style.css';
</script>

<div class="layout h-full p-12">
  <header class="header">
    <h2 class="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
      Instances
    </h2>
  </header>
  <section class="sidebar">
    <SettingsMenu />
  </section>
  <section class="subnav flex gap-2">
    <Button href="/dashboard" variant="ghost" class="w-28">Dashboard</Button>
    <Button href="/schema" variant="ghost" class="w-28">Schema</Button>
  </section>
</div>
