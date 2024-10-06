import type { Snippet } from 'svelte';
import type { Merge } from 'type-fest';

export type PropsWithChildren<T = Record<string, never>> = Merge<T, { children: Snippet }>;
