<script>
  import HomePageList from "$lib/components/homePage/HomePageList.svelte";
  import { useAuthState } from "$lib/states/authState.svelte.js";
  import { initHomepage } from "$lib/states/homePageState.svelte.js";
  const authState = useAuthState();

  $effect(() => {
    initHomepage();
  });
</script>

<h1 class="text-3xl my-4">Welcome to the home page!</h1>

{#if authState.user}
  <a href="/communities" class="btn preset-filled-primary-500 inline-blockp-2 my-4">Go to communities</a>
{/if}

<HomePageList />