<script>
  import { browser } from "$app/environment";
  import { useCommunityState } from "$lib/states/communityState.svelte.js";
  let communityState = useCommunityState();
  import { useAuthState } from "$lib/states/authState.svelte.js";
  let authState = useAuthState();

  function addCommunity(e) {
    e.preventDefault();
    const community = Object.fromEntries(new FormData(e.target));
    communityState.addCommunity(community);
    e.target.reset();
  };

</script>

{#if authState.user}
  <form onsubmit={addCommunity} class="space-y-4 max-w-md">
    <label class="label">
      <input type="text" placeholder="Community Name" name="name" class="input"/>
    </label>
    <label class="label">
      <textarea placeholder="Community Description" name="description" class="textarea"></textarea>
    </label>
    <button type="submit" class="btn preset-filled-primary-500">Add Community</button>
  </form>
{/if}