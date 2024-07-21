<script lang="ts">
  import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
  import { Input } from '$lib/components/ui/input';
  import * as Select from '$lib/components/ui/select';
  import * as Table from '$lib/components/ui/table';
  import type { AttributeFormState, AttributeData } from './AttributeState.svelte';
  import { cn } from '$lib/utils';
  import { ATTRIBUTE_TYPES, type AttributeType } from '$lib/data/models/attribute.types';
  import { Button } from '$lib/components/ui/button';
  import { Trash2 } from 'lucide-svelte';

  interface IProps {
    disabled?: boolean;
    data: AttributeFormState;
    modify: (c: Partial<AttributeData>) => void;
    toggleDelete: () => void;
  }

  let { data, modify, toggleDelete, disabled }: IProps = $props();

  const getModifiedFields = (modified: AttributeData, current: AttributeData) => {
    if (!data.id) {
      return {
        name: true,
        required: true,
        type: true
      };
    }

    return {
      name: modified.name !== current.name,
      required: modified.required !== current.required,
      type: modified.type !== current.type
    };
  };

  let name = $state(data.modified.name);
  let modifiedFields = $derived(getModifiedFields(data.modified, data.current));
</script>

<Table.Row class={cn(data.delete && 'bg-red-200/40')}>
  <Table.Cell>
    <Input
      {disabled}
      required
      class={cn(modifiedFields.name ? 'border-green-300 border-2 focus:border-none' : '')}
      placeholder="Name"
      bind:value={name}
      on:change={() => {
        modify({ name });
      }}
    ></Input>
  </Table.Cell>
  <Table.Cell>
    <Select.Root
      required
      {disabled}
      onSelectedChange={(selected) => {
      if (selected && ([...ATTRIBUTE_TYPES] as unknown[]).includes(selected.value)) {
        modify({ type: selected.value as AttributeType });
      }
      }}
    >
      <Select.Trigger
        bind:value={data.modified.type}
        class={cn(modifiedFields.type ? 'border-green-300 border-2 focus:border-none' : '')}
      >
        <Select.Value placeholder={data.modified.type}></Select.Value>
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="string"></Select.Item>
        <Select.Item value="boolean"></Select.Item>
        <Select.Item value="number"></Select.Item>
      </Select.Content>
    </Select.Root>
  </Table.Cell>
  <Table.Cell>
    <Checkbox
      {disabled}
      required
      class={cn('block mt-2', modifiedFields.required ? 'ring-green-300 ring-2 ring-offset-2' : '')}
      checked={data.modified.required}
      onCheckedChange={(checked) => {
        if (checked !== 'indeterminate') modify({ required: checked });
      }}
    ></Checkbox>
  </Table.Cell>
  <Table.Cell></Table.Cell>
  <Table.Cell class="">
    <Button
      {disabled}
      size="icon"
      variant="outline"
      class={cn(data.delete && 'bg-red-300')}
      onclick={toggleDelete}><Trash2 class="w-3"></Trash2></Button
    >
  </Table.Cell>
</Table.Row>
