<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  export let title = 'Create project';
  export let description = '';
</script>

<Card.Root class="w-[300px]">
  <Card.Header>
    <Card.Title>{title}</Card.Title>
    <Card.Description>{description}</Card.Description>
  </Card.Header>
</Card.Root>
