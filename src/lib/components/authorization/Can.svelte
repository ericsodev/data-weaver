<script lang="ts" generics="T extends SchemaAbility | InstanceAbility | SystemAbility">
  import type { InstanceAbility } from '$lib/auth/roles/instance-permissions';
  import type { SchemaAbility } from '$lib/auth/roles/schema-permissions';
  import type { SystemAbility } from '$lib/auth/roles/system-permissions';
  import type { PropsWithChildren } from '../component.types';

  interface $$Props<
    // eslint-disable-next-line @typescript-eslint/ban-types
    R extends SchemaAbility | InstanceAbility | SystemAbility
  > {
    I: R;
    abilities: R[];
  }

  // eslint-disable-next-line no-undef
  let { I, abilities, children }: PropsWithChildren<$$Props<T>> = $props();
</script>

{#if (abilities as string[]).includes(I)}
  {@render children()}
{/if}
