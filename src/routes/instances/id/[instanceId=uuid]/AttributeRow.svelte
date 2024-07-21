<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import Input from '$lib/components/ui/input/input.svelte';
  import { TableCell, TableRow } from '$lib/components/ui/table';
  import type { AttributeDTO } from '$lib/data/models/attributeModel';
  import { AsteriskIcon, RotateCcwIcon } from 'lucide-svelte';

  interface IProps {
    attribute: AttributeDTO;
  }

  let { attribute }: IProps = $props();
</script>

<TableRow>
  <TableCell>{attribute.name}</TableCell>
  <TableCell class="text-muted-foreground">
    {attribute.type}
    {#if attribute.required}
      <AsteriskIcon class="ml-0.5 w-3.5 inline-block text-red-400"></AsteriskIcon>
    {/if}
  </TableCell>
  <TableCell>
    {#if attribute.type === 'string'}
      <Input type="text" required={attribute.required}></Input>
    {:else if attribute.type === 'number'}
      <Input type="number" required={attribute.required}></Input>
    {:else}
      <Checkbox></Checkbox>
    {/if}
  </TableCell>

  <TableCell
    ><Button variant="outline" size="icon">
      <RotateCcwIcon class="w-4"></RotateCcwIcon>
    </Button>
  </TableCell>
</TableRow>
