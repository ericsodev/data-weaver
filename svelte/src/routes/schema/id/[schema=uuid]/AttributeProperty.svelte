<script lang="ts">
  import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
  import { Input } from '$lib/components/ui/input';
  import * as Select from '$lib/components/ui/select';
  import * as Table from '$lib/components/ui/table';
  import type { AttributeDTO } from '$lib/data/models/attributeModel';
  import { cn } from '$lib/utils';

  type AttributeData = Pick<AttributeDTO, 'name' | 'type' | 'required'>;
  export let data: AttributeData;
  let name = data.name;
  let required = data.required;
  let dataType = data.type;

  const getModifiedFields = (
    name: string,
    required: boolean,
    dataType: string,
    data: AttributeData
  ) => {
    return {
      name: name !== data.name,
      required: required !== data.required,
      type: dataType !== data.type
    };
  };

  $: modifiedFields = getModifiedFields(name, required, dataType, data);
</script>

<Table.Row>
  <Table.Cell>
    <Input
      required
      class={cn(modifiedFields.name ? 'border-green-300 border-2 focus:border-none' : '')}
      placeholder="Name"
      bind:value={name}
    ></Input>
  </Table.Cell>
  <Table.Cell>
    <Select.Root
      required
      selected={{ value: dataType }}
      onSelectedChange={(type) => {
        type && (dataType = type.value);
      }}
    >
      <Select.Trigger
        bind:value={dataType}
        class={cn(modifiedFields.type ? 'border-green-300 border-2 focus:border-none' : '')}
      >
        <Select.Value placeholder={dataType}></Select.Value>
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
      required
      class={cn(
        'block mt-2 mx-auto',
        modifiedFields.required ? 'ring-green-300 ring-2 ring-offset-2' : ''
      )}
      bind:checked={required}
    ></Checkbox>
  </Table.Cell>
</Table.Row>
