<script>
  import "../app.css";
  import { useAuthState } from "$lib/states/authState.svelte.js";
  import Header from "$lib/components/layout/Header.svelte";
  let { children } = $props();
  const authState = useAuthState();
</script>

<div class="flex flex-col min-h-screen bg-gray-50 text-gray-900">
  <Header />

  <main class="container mx-auto max-w-4xl w-full px-4 py-6 grow">
    {@render children()}
  </main>
</div>