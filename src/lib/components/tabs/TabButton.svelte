<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { cn } from '$lib/utils';
  interface Props {
    name: string;
    selectedTab: string;
  }
  let { name, selectedTab = $bindable() }: Props = $props();
</script>

<Button
  variant="link"
  class={cn(name === selectedTab ? 'text-foreground underline' : 'text-muted-foreground')}
  onclick={() => {
    selectedTab = name;
  }}
>
  {name}
</Button>
