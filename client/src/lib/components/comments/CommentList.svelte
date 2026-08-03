<script >
  import { useCommentState } from "$lib/states/commentState.svelte";
  const commentState = useCommentState();
  import { useAuthState } from "$lib/states/authState.svelte.js";
  const authState = useAuthState();
  import VoteControl from "$lib/components/VoteControl.svelte";

  let { communityId, postId } = $props();
  
  const comments = $derived(commentState?.comments[postId] || []);
</script>

<ul class="space-y-3">
  {#each comments as comment}
  <li class="card space-y-3">
    <span class="text-sm font-medium text-gray-500">{comment.author}</span>
    <p class="text-gray-700 whitespace-pre-wrap wrap-break-word">{comment.content}</p>
    <div class="flex items-center gap-3">
      <VoteControl
        score={comment.upvotes - comment.downvotes}
        userVote={comment.userVote}
        disabled={!authState.user}
        onUp={() => commentState.upvoteComment(communityId, postId, comment.id)}
        onDown={() => commentState.downvoteComment(communityId, postId, comment.id)}
      />
      {#if authState.user && Number(comment.created_by) === Number(authState.user.id)}
      <button onclick={() => commentState.removeComment(communityId, postId, comment.id)} class="btn btn-sm btn-danger">Remove</button>
      {/if}
    </div>
  </li>
  {/each}
</ul>