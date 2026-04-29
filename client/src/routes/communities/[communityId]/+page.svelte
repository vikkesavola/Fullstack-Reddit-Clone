<script>
  import Community from "$lib/components/communities/Community.svelte";
  import CommunityForm from "$lib/components/communities/CommunityForm.svelte";
  import PostList from "$lib/components/posts/PostList.svelte";
  import PostForm from "$lib/components/posts/PostForm.svelte";
  import { initCommunity } from "$lib/states/communityState.svelte";
  import { initPosts } from "$lib/states/postState.svelte";
  import { page } from "$app/state";
  let communityId = $derived(page.params.communityId);
  
  $effect(() => {
    initCommunity(communityId);
    initPosts(communityId);
  });
  
</script>

<Community communityId={page.params.communityId} />
<PostList communityId={page.params.communityId} />
<PostForm communityId={page.params.communityId} />
