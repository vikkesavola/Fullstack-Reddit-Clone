<script >
  import { useCommentState } from "$lib/states/commentState.svelte";
  const commentState = useCommentState();
  import { useAuthState } from "$lib/states/authState.svelte.js";
  const authState = useAuthState();
  
  
  let { communityId, postId } = $props();
  
  const comments = $derived(commentState?.comments[postId] || []);
</script>

<ul>
  {#each comments as comment}
  <li class="bg-tertiary-200 my-8 p-5">
    <p>{comment.content}</p>
    <br/>
    <span>Upvotes: {comment.upvotes}</span>
    <span>Downvotes: {comment.downvotes}</span>
    <br/>
    {#if authState.user}
    <button onclick={() => commentState.upvoteComment(communityId, postId, comment.id)} class="btn btn-sm preset-filled-success-500">Upvote</button>
    <button onclick={() => commentState.downvoteComment(communityId, postId, comment.id)} class="btn btn-sm preset-filled-error-500">Downvote</button>
    <br/>
    <br/>
    {/if}
    {#if authState.user && Number(comment.created_by) === Number(authState.user.id)}
    <button onclick={() => commentState.removeComment(communityId, postId, comment.id)} class="btn btn-sm preset-tonal-error border-1">Remove</button>
    {/if}
  </li>
  {/each}
</ul>