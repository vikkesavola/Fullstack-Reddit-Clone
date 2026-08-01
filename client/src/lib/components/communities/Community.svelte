<script>
    import { useCommunityState } from "$lib/states/communityState.svelte";
    let communityState = useCommunityState();
    let { communityId } = $props();
    let community = $derived(communityState.communities.find((c) => c.id === parseInt(communityId)));
</script>

<div>
  <h1 class="text-2xl font-bold">{community ? community.name : "Loading..."}</h1>
  <p class="mt-1 text-gray-600 whitespace-pre-wrap break-words">{community ? community.description : "Loading..."}</p>
</div>