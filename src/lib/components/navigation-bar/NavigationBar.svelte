<script lang="ts">
  import { Button } from '../ui/button';
  import { page } from '$app/stores';
  import { cn } from '$lib/utils';
  import { FileText, Layers, SwatchBook } from 'lucide-svelte';

  let path = $page.url.pathname;
</script>

<section class="subnav flex gap-2">
  <Button
    href="/authed/dashboard"
    variant={path.startsWith('/authed/dashboard') ? 'secondary' : 'ghost'}
    class={cn('text-muted-foreground', path.startsWith('/authed/dashboard') && 'text-white')}
  >
    <span>
      <Layers class="w-4 mr-2"></Layers>
    </span>
    Dashboard</Button
  >
  <Button
    data-sveltekit-prefetch
    href="/authed/schema"
    variant={path.startsWith('/authed/schema') ? 'secondary' : 'ghost'}
    class={cn('text-muted-foreground', path.startsWith('/authed/schema') && 'text-white')}
  >
    <span>
      <SwatchBook class="w-4 mr-2"></SwatchBook>
    </span>
    Schema
  </Button>
  <Button
    data-sveltekit-prefetch
    href="/authed/instances"
    variant={path.startsWith('/authed/instances') ? 'secondary' : 'ghost'}
    class={cn('text-muted-foreground', path.startsWith('/authed/instances') && 'text-white')}
  >
    <span>
      <FileText class="w-4 mr-2"></FileText>
    </span>

    Instances</Button
  >
</section>
