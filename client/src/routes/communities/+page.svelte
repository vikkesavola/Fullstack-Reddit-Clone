<script>
  import CommunityList from "$lib/components/communities/CommunityList.svelte";
  import CommunityForm from "$lib/components/communities/CommunityForm.svelte";
  import { initCommunities } from "$lib/states/communityState.svelte";
  
  $effect(() => {
    initCommunities();
  });

</script>

<div class="space-y-6">
  <h1 class="text-2xl font-bold">Communities</h1>

  <CommunityList />
  <CommunityForm />
</div>
