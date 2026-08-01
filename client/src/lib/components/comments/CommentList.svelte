<script >
  import { useCommentState } from "$lib/states/commentState.svelte";
  const commentState = useCommentState();
  import { useAuthState } from "$lib/states/authState.svelte.js";
  const authState = useAuthState();
  
  
  let { communityId, postId } = $props();
  
  const comments = $derived(commentState?.comments[postId] || []);
</script>

<ul class="space-y-4">
  {#each comments as comment}
  <li class="border border-surface-200-800 bg-surface-100-900 rounded-lg p-4 space-y-3">
    <p>{comment.content}</p>
    <div class="flex gap-4 text-sm opacity-80">
      <span>Upvotes: {comment.upvotes}</span>
      <span>Downvotes: {comment.downvotes}</span>
    </div>
    {#if authState.user}
    <div class="flex flex-wrap gap-2">
      <button onclick={() => commentState.upvoteComment(communityId, postId, comment.id)} class="btn btn-sm preset-filled-success-500">Upvote</button>
      <button onclick={() => commentState.downvoteComment(communityId, postId, comment.id)} class="btn btn-sm preset-filled-error-500">Downvote</button>
      {#if Number(comment.created_by) === Number(authState.user.id)}
      <button onclick={() => commentState.removeComment(communityId, postId, comment.id)} class="btn btn-sm preset-tonal-error">Remove</button>
      {/if}
    </div>
    {/if}
  </li>
  {/each}
</ul>