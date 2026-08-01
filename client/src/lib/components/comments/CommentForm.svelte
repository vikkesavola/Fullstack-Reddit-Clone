<script>
  import { useCommentState } from "$lib/states/commentState.svelte";
  const commentState = useCommentState();
  import { useAuthState } from "$lib/states/authState.svelte.js";
  const authState = useAuthState();

  let { communityId, postId } = $props();

  const addComment = (e) => {
    e.preventDefault();
    const comment = Object.fromEntries(new FormData(e.target));
    commentState.addComment(communityId, postId, comment);
    e.target.reset();
  };
</script>

{#if authState.user}
  <form onsubmit={addComment} class="space-y-4 my-8">
    <label class="label">
      <textarea placeholder="Comment content" name="content" class="textarea"></textarea>
    </label>
    <button type="submit" class="btn btn-primary">Add comment</button>
  </form>
{/if}