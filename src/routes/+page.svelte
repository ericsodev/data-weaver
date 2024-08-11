<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import FeatureCard from './FeatureCard.svelte';
  export let data;
</script>

<div class="flex h-full flex-col p-4">
  <header
    class="flex w-full shrink grow-0 basis-1/2 flex-col items-center justify-center gap-2 text-center"
  >
    <h1 class="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">Data Weaver</h1>
    <p class="text-xl text-muted-foreground">Minimal headless content management system</p>
  </header>
  <main class="space-y-10">
    <section class="space-y-5">
      <h2 class="text-center text-2xl font-bold">Features</h2>
      <section
        class="mx-auto flex scroll-m-20 flex-col items-center justify-center gap-5 md:flex-row md:items-stretch"
      >
        <FeatureCard title="Easy setup" description="Provided docker setup" />
        <FeatureCard
          title="Multiple database adapters"
          description="Connect to SQLite, Postgres, MySQL"
        />
        <FeatureCard
          title="Fine grain access controls"
          description="Column level per user access control"
        />
      </section>
    </section>
    <section class="flex justify-center gap-5">
      {#if !data.user}
        <Button href="/register">Get Started</Button>
        <Button href="/login" class="w-24" variant="secondary">Login</Button>
      {:else}
        <Button href="/authed/dashboard" class="px-6">Go to dashboard</Button>
      {/if}
    </section>
  </main>
</div>
