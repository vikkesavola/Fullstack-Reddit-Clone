<script >
  import { useCommentState } from "$lib/states/commentState.svelte";
  const commentState = useCommentState();
  import { useAuthState } from "$lib/states/authState.svelte.js";
  const authState = useAuthState();
  
  
  let { communityId, postId } = $props();
  
  const comments = $derived(commentState?.comments[postId] || []);
</script>

<ul class="space-y-3">
  {#each comments as comment}
  <li class="card space-y-3">
    <p class="text-gray-700 whitespace-pre-wrap break-words">{comment.content}</p>
    <div class="flex gap-4 text-sm text-gray-500">
      <span>Upvotes: {comment.upvotes}</span>
      <span>Downvotes: {comment.downvotes}</span>
    </div>
    {#if authState.user}
    <div class="flex flex-wrap gap-2">
      <button onclick={() => commentState.upvoteComment(communityId, postId, comment.id)} class="btn btn-sm btn-success">Upvote</button>
      <button onclick={() => commentState.downvoteComment(communityId, postId, comment.id)} class="btn btn-sm btn-secondary">Downvote</button>
      {#if Number(comment.created_by) === Number(authState.user.id)}
      <button onclick={() => commentState.removeComment(communityId, postId, comment.id)} class="btn btn-sm btn-danger">Remove</button>
      {/if}
    </div>
    {/if}
  </li>
  {/each}
</ul>