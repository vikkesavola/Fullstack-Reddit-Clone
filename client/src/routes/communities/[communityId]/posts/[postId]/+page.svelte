<script>
  import { page } from "$app/state";
  import Post from "$lib/components/posts/Post.svelte";
  import { initCommunity } from "$lib/states/communityState.svelte";
  import { initPost, initPosts } from "$lib/states/postState.svelte";
  import { initComments } from "$lib/states/commentState.svelte";
    import CommentForm from "$lib/components/comments/CommentForm.svelte";
    import CommentList from "$lib/components/comments/CommentList.svelte";
  let communityId = $derived(page.params.communityId);
  let postId = $derived(page.params.postId);

  $effect(() => {
    initCommunity(communityId);
    initPost(communityId, postId);
    initComments(communityId, postId);
  });
</script>

<div class="space-y-6">
  <Post {communityId} {postId}/>
  <CommentForm {communityId} {postId}/>
  <CommentList {communityId} {postId}/>
</div>