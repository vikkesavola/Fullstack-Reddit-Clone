<script>
  import { usePostState } from "$lib/states/postState.svelte";
  import { useAuthState } from "$lib/states/authState.svelte.js";
  import { goto } from "$app/navigation";
  let authState = useAuthState();
  import VoteControl from "$lib/components/VoteControl.svelte";
  import PostByline from "$lib/components/posts/PostByline.svelte";
  let postState = usePostState();
  
  let { communityId, postId } = $props();
  let communityIdInt = $derived(parseInt(communityId));
  
  let post = $derived(postState.posts[communityId]?.find((p) => p.id === parseInt(postId)));

  let message = $state("");

  const onRemove = () => {
    message = "Post removed. Redirecting..."
    postState.removePost(communityIdInt, post.id);
    setTimeout(() => goto(`/communities/${communityIdInt}`), 1000);
  };

</script>

{#if message}
  <div class="bg-green-50 border border-green-200 text-green-800 rounded-md p-3 mb-4 max-w-md">
    <p>{message}</p>
  </div>
{/if}

<div class="card space-y-3">
  {#if post}
    <PostByline author={post.author} communityId={post.community_id} communityName={post.community_name} />
  {/if}
  <h1 class="text-2xl font-bold">{post ? post.title : "Loading..."}</h1>
  <p class="mt-2 text-gray-700 whitespace-pre-wrap wrap-break-word">{post ? post.content : "Loading..."}</p>
  <div class="flex items-center gap-3">
    {#if post}
    <VoteControl
      score={post.upvotes - post.downvotes}
      userVote={post.userVote}
      disabled={false}
      onUp={() => postState.upvotePost(communityId, post.id)}
      onDown={() => postState.downvotePost(communityId, post.id)}
    />
    {/if}
    {#if post && authState.user && Number(authState.user.id) === Number(post.created_by)}
      <button onclick={() => onRemove()} class="btn btn-sm btn-danger">Remove</button>
    {/if}
  </div>
</div>