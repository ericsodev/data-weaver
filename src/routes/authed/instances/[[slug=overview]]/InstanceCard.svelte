<script lang="ts">
  import { goto } from '$app/navigation';
  import { Badge } from '$lib/components/ui/badge';
  import { Card, CardContent } from '$lib/components/ui/card';
  import CardFooter from '$lib/components/ui/card/card-footer.svelte';
  import CardHeader from '$lib/components/ui/card/card-header.svelte';
  import CardTitle from '$lib/components/ui/card/card-title.svelte';
  import type { PageData } from './$types';
  interface Props {
    instance: PageData['instances'][number];
  }
  let { instance }: Props = $props();
</script>

<Card
  class="cursor-pointer hover:bg-secondary transition-colors"
  onclick={() => {
    goto(`/authed/instances/id/${instance.id}`);
  }}
>
  <CardHeader>
    <CardTitle>{instance.name}</CardTitle>
  </CardHeader>
  <CardContent>{instance.description}<br /></CardContent>
  <CardFooter>
    <Badge variant="secondary">{instance.role}</Badge>
  </CardFooter>
</Card>
