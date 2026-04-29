<script>
    import { useCommunityState } from "$lib/states/communityState.svelte";
    let communityState = useCommunityState();
    let { communityId } = $props();
    let community = $derived(communityState.communities.find((c) => c.id === parseInt(communityId)));
</script>

<h1 class="text-3xl my-4">{community ? community.name : "Loading..."}</h1>
<p class="text-lg">{community ? community.description : "Loading..."}</p>