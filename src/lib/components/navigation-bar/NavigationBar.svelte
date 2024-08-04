<script lang="ts">
  import { Button } from '../ui/button';
  import { page } from '$app/stores';
  import { cn } from '$lib/utils';

  let path = $page.url.pathname;
</script>

<section class="subnav flex gap-2">
  <Button
    href="/dashboard"
    variant={path.startsWith('/dashboard') ? 'secondary' : 'ghost'}
    class={cn('w-28 text-muted-foreground', path.startsWith('/dashboard') && 'text-white')}
    >Dashboard</Button
  >
  <Button
    data-sveltekit-prefetch
    href="/schema"
    variant={path.startsWith('/schema') ? 'secondary' : 'ghost'}
    class={cn('w-28 text-muted-foreground', path.startsWith('/schema') && 'text-white')}
    >Schema</Button
  >
  <Button
    data-sveltekit-prefetch
    href="/instances"
    variant={path.startsWith('/instances') ? 'secondary' : 'ghost'}
    class={cn('w-28 text-muted-foreground', path.startsWith('/instances') && 'text-white')}
    >Instances</Button
  >
</section>
