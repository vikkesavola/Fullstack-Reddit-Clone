<script>
  import HomePageList from "$lib/components/homePage/HomePageList.svelte";
  import { useAuthState } from "$lib/states/authState.svelte.js";
  import { initHomepage } from "$lib/states/homePageState.svelte.js";
  const authState = useAuthState();

  $effect(() => {
    initHomepage();
  });
</script>

<div class="space-y-6">
  <h1 class="text-2xl font-bold">Welcome to the home page!</h1>

  {#if authState.user}
    <a href="/communities" class="btn btn-primary">Go to communities</a>
  {/if}

  <HomePageList />
</div>