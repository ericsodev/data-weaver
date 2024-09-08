<script>
  import '$lib/fonts/stylesheet.css';
  import '../app.pcss';

  let { children } = $props();
</script>

<svelte:head><title>Dataweaver</title></svelte:head>
{@render children()}
