<script>
  import { useAuthState } from "$lib/states/authState.svelte.js";
  const authState = useAuthState();
</script>

<header class="bg-slate-800 text-white">
  <nav class="container mx-auto max-w-4xl w-full flex items-center gap-6 px-4 py-3">
    <span class="font-semibold">
      {#if authState.user}
        Hello, {authState.user.username}!
      {:else}
        Hello anonymous!
      {/if}
    </span>

    <div class="ml-auto flex items-center gap-4 text-sm">
      <a href="/" class="text-slate-200 hover:text-white">Home</a>
      <a href="/communities" class="text-slate-200 hover:text-white">Communities</a>
      {#if authState.user}
        <button onclick={() => authState.logout()} class="text-slate-200 hover:text-white cursor-pointer">Logout</button>
      {:else}
        <a href="/auth/login" class="text-slate-200 hover:text-white">Login</a>
        <a href="/auth/register" class="text-slate-200 hover:text-white">Register</a>
      {/if}
    </div>
  </nav>
</header>
