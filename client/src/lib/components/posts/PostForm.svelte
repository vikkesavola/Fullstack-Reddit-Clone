<script>
  import { usePostState } from "$lib/states/postState.svelte.js";
  const postState = usePostState();
  import { useAuthState } from "$lib/states/authState.svelte.js";
  const authState = useAuthState();

  let { communityId } = $props();

  const addPost = (e) => {
    e.preventDefault();
    const post = Object.fromEntries(new FormData(e.target));
    postState.addPost(communityId, post);
    e.target.reset();
  };
</script>

{#if authState.user}
  <form onsubmit={addPost} class="space-y-4 my-8 max-w-md">
    <label class="label">
      <input type="text" placeholder="Post title" name="title" class="input">
    </label>
    <textarea placeholder="Post content" name="content" class="textarea"></textarea>
    <button type="submit" class="btn btn-primary">Add post</button>
  </form>
{/if}