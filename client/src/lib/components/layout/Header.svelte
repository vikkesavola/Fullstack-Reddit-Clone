<script>
  import { useAuthState } from "$lib/states/authState.svelte.js";
  const authState = useAuthState();
</script>


<header>
  <nav class="flex bg-primary-600 p-4 gap-5 font-normal text-white">
    {#if authState.user}
    <div class="text-lg flex-1">
      <span>
        Hello, {authState.user.email}!
      </span>
    </div>
    <div class="ml-auto flex flex-row gap-5 text-base flex-1 justify-center items-center">
      <a href="/" class="hover:underline">Home</a>
      <a href="/communities" class="hover:underline">Communities</a>
    </div>
    <div class="flex flex-1 items-center">
      <button onclick={() => authState.logout()} class="ml-auto justify-end hover:underline">Logout</button>
    </div>
    {:else}
    <div class="text-lg flex-1">
      <span>
        Hello anonymous!
      </span>
    </div>
    <div class="ml-auto flex flex-1 flex-row gap-5 text-base justify-center items-center">
      <a href="/" class="hover:underline">Home</a>
      <a href="/communities" class="hover:underline">Communities</a>
    </div>
    <ul class="flex flex-1 flex-row gap-5 ml-auto justify-end items-center">
      <li><a href="/auth/login" class="hover:underline">Login</a></li>
      <li><a href="/auth/register" class="hover:underline">Register</a></li>
    </ul>
    {/if}
  </nav>
</header>
