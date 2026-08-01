<script>
  import "../app.css";
  import { useAuthState } from "$lib/states/authState.svelte.js";
  import Header from "$lib/components/layout/Header.svelte";
  let { children } = $props();
  const authState = useAuthState();
</script>

<div class="flex flex-col h-screen bg-surface-50-950">
  <Header />

  <main class="container mx-auto px-4 py-6 grow">
    {@render children()}
  </main>
</div>