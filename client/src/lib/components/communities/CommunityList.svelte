<script >
  import {useCommunityState} from "$lib/states/communityState.svelte.js";
  import {useAuthState} from "$lib/states/authState.svelte.js";
  let communityState = useCommunityState();
  let authState = useAuthState();

  let { communityId } = $props();
  let communityIdInt = $derived(parseInt(communityId));

</script>

<ul class="space-y-4">
  {#each communityState.communities as community}
  <li class="border border-surface-200-800 bg-surface-100-900 rounded-lg p-4 space-y-2">
    <h2>
      <a href="/communities/{community.id}" class="text-2xl font-semibold inline-block anchor">{community.name}</a>
    </h2>
    <p class="opacity-80">{community.description}</p>
    {#if authState.user && Number(authState.user.id) === Number(community.created_by)}
      <button onclick={() => communityState.removeCommunity(community.id)} class="btn btn-sm preset-tonal-error">Remove</button>
    {/if}
  </li>
  {/each}
</ul>