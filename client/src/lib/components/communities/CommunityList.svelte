<script >
  import {useCommunityState} from "$lib/states/communityState.svelte.js";
  import {useAuthState} from "$lib/states/authState.svelte.js";
  let communityState = useCommunityState();
  let authState = useAuthState();

  let { communityId } = $props();
  let communityIdInt = $derived(parseInt(communityId));

</script>

<ul>
  {#each communityState.communities as community} 
  <li class="bg-tertiary-200 my-8 p-5">
    <h2>
      <a href="/communities/{community.id}" class="text-2xl inline-block anchor">{community.name}</a>
    </h2>
    <p class="text-lg">{community.description}</p>
    {#if authState.user && Number(authState.user.id) === Number(community.created_by)}
      <button onclick={() => communityState.removeCommunity(community.id)} class="my-4 btn btn-sm preset-tonal-primary">Remove</button>
    {/if}
  </li>
  {/each}
</ul>