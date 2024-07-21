<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Label } from './ui/label';

  interface IProps {
    label: string;
    children: Snippet;
  }

  let { label, children }: IProps = $props();
</script>

<div>
  <Label class="inline-block mb-2">{label}</Label>
  {@render children()}
</div>
