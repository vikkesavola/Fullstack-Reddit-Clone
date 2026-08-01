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
  <li class="card space-y-2">
    <h2>
      <a href="/communities/{community.id}" class="text-xl font-semibold text-gray-900 hover:underline">{community.name}</a>
    </h2>
    <p class="text-gray-600">{community.description}</p>
    {#if authState.user && Number(authState.user.id) === Number(community.created_by)}
      <button onclick={() => communityState.removeCommunity(community.id)} class="btn btn-sm btn-danger">Remove</button>
    {/if}
  </li>
  {/each}
</ul>