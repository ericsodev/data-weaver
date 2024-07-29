<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import Input from '$lib/components/ui/input/input.svelte';
  import { Switch } from '$lib/components/ui/switch';
  import { TableCell, TableRow } from '$lib/components/ui/table';
  import type { AttributeDTO } from '$lib/data/models/attributeModel';
  import { cn } from '$lib/utils';
  import { AsteriskIcon, PencilIcon, RotateCcwIcon } from 'lucide-svelte';
  interface IProps {
    schema: AttributeDTO;
    value: string | boolean | number | null;
    error: string | undefined;
    modified?: boolean;
    reset: () => void;
  }

  let { schema: attribute, value = $bindable(), modified, reset, error }: IProps = $props();
  let touched = $state(false);

  let highlightError = $derived(touched && error);
</script>

<TableRow>
  <TableCell>{attribute.name}</TableCell>
  <TableCell class="text-muted-foreground">
    {attribute.type}
    {#if attribute.required}
      <AsteriskIcon class="ml-0.5 w-3.5 inline-block text-red-400"></AsteriskIcon>
    {/if}
  </TableCell>
  <TableCell class="flex gap-1.5">
    {#if attribute.type === 'string'}
      <Input
        bind:value
        type="text"
        onfocus={() => (touched = true)}
        required={attribute.required}
        class={cn(
          'shrink grow basis-40 lg:inline-block hidden',
          highlightError && '[&:not(:focus)]:border-red-500'
        )}
      />
      <Button variant="outline" size="icon" class="grow-0 shrink-0"
        ><PencilIcon class="w-3.5"></PencilIcon></Button
      >
    {:else if attribute.type === 'number'}
      <Input
        bind:value
        type="number"
        onfocus={() => (touched = true)}
        on:keypress={(e) => !isFinite(Number(e.key)) && e.preventDefault()}
        required={attribute.required}
        class={cn(
          'shrink grow basis-40 lg:inline-block hidden',
          highlightError && '[&:not(:focus)]:border-red-500'
        )}
      />
      <Button variant="outline" size="icon" class="grow-0 shrink-0"
        ><PencilIcon class="w-3.5"></PencilIcon></Button
      >
    {:else if attribute.type === 'boolean'}
      <Switch
        onfocus={() => (touched = true)}
        checked={!!value}
        onCheckedChange={(v) => (value = v)}
        class={cn(highlightError && '[&:not(:focus)]:border-red-500')}
      ></Switch>
    {/if}
  </TableCell>

  <TableCell class={cn(!modified && 'opacity-0')}>
    <Button
      variant="outline"
      size="icon"
      onclick={reset}
      disabled={!modified}
      class={cn('bg-green-300/50 hover:bg-green-400/50')}
    >
      <RotateCcwIcon class="w-4"></RotateCcwIcon>
    </Button>
  </TableCell>
</TableRow>
