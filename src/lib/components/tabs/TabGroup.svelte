<script lang="ts">
  import type { Snippet } from 'svelte';
  import TabButton from './TabButton.svelte';

  interface Props {
    options: { name: string; content: Snippet }[];
    defaultSelected: string;
  }

  let { options, defaultSelected }: Props = $props();

  let selectedTab = $state(defaultSelected);
  let content = $derived(options.find((opt) => opt.name === selectedTab)?.content);
</script>

<div class="flex gap-1 mb-5">
  {#each options as { name }}
    <TabButton {name} bind:selectedTab></TabButton>
  {/each}
</div>

{#if content !== undefined}
  {@render content()}
{/if}
