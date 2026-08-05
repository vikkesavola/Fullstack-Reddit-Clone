<script>
  import HomePageList from "$lib/components/homePage/HomePageList.svelte";
  import { useAuthState } from "$lib/states/authState.svelte.js";
  import { initHomepage } from "$lib/states/homePageState.svelte.js";
  const authState = useAuthState();

  $effect(() => {
    initHomepage();
  });

  let message=$state("");
  let errorMessage = $state("");
  let isLoading = $state(false);

  const demoLogin = async () => {
    message="";
    errorMessage="";
    isLoading=true;

    try {
      await authState.login("demo@example.com", "password123");
      message = "Login successful!";
      setTimeout(() => { message = ""; }, 2000);
    } catch (error) {
      errorMessage = error.message;
    } finally {
      isLoading = false;
    }
    
  }
</script>

<div class="space-y-6">
  <h1 class="text-2xl font-bold">Welcome to the home page!</h1>

  {#if message}
    <div class="bg-green-50 border border-green-200 text-green-800 rounded-md p-3 mb-4 max-w-md">
      <p>{message}</p>
    </div>
  {/if}

  {#if errorMessage}
    <div class="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 mb-4 max-w-md">
      <p>{errorMessage}</p>
    </div>
  {/if}

  {#if authState.user}
    <a href="/communities" class="btn btn-primary">Go to communities</a>
  {:else}
    <button type="button" onclick={demoLogin} class="btn btn-primary">
      {isLoading
        ? "Please wait..."
        : "Demo login"}  
    </button>
  {/if}

  <HomePageList />
</div>