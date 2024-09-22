<script lang="ts">
  import { goto } from '$app/navigation';
  import { Badge } from '$lib/components/ui/badge';
  import { Card, CardContent } from '$lib/components/ui/card';
  import CardFooter from '$lib/components/ui/card/card-footer.svelte';
  import CardHeader from '$lib/components/ui/card/card-header.svelte';
  import CardTitle from '$lib/components/ui/card/card-title.svelte';
  import type { PageData } from './$types';
  interface Props {
    schema: PageData['schemas'][number];
  }

  let { schema }: Props = $props();
</script>

<Card
  class="cursor-pointer hover:bg-secondary transition-colors"
  onclick={() => {
    goto(`/authed/schema/id/${schema.id}`);
  }}
>
  <CardHeader>
    <CardTitle>{schema.name}</CardTitle>
  </CardHeader>
  <CardContent>{schema.description}</CardContent>
  <CardFooter>
    <Badge variant="secondary">{schema.role}</Badge>
  </CardFooter>
</Card>
