<script lang="ts">
  export let data;
</script>

<div>
  <header>
    <h2 class="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
      Dashboard
    </h2>
  </header>
  <main class="">Hello {data.session?.username}</main>
</div>
