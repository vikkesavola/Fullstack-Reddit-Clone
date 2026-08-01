<script >
  import {usePostState} from "$lib/states/postState.svelte.js";
  let postState = usePostState();
  import { useAuthState } from "$lib/states/authState.svelte.js";
  let authState = useAuthState();

  let { communityId } = $props();
  let communityIdInt = $derived(parseInt(communityId));
  let currentPosts = $derived(postState.posts[communityIdInt] || []);
</script>

<ul class="space-y-4">
  {#each currentPosts as post}
    <li class="border border-surface-200-800 bg-white dark:bg-surface-900 shadow-sm rounded-lg p-4 space-y-3">
      <h2 class="text-xl font-semibold">
        <a href="/communities/{communityIdInt}/posts/{post.id}" class="anchor">{post.title}</a>
      </h2>
      <p>{post.content}</p>
      <div class="flex gap-4 text-sm opacity-80">
        <span>Upvotes: {post.upvotes}</span>
        <span>Downvotes: {post.downvotes}</span>
      </div>
      {#if authState.user}
        <div class="flex flex-wrap gap-2">
          <button onclick={() => postState.upvotePost(communityId, post.id)} class="btn btn-sm preset-filled-success-500">Upvote</button>
          <button onclick={() => postState.downvotePost(communityId, post.id)} class="btn btn-sm preset-filled-error-500">Downvote</button>
          {#if Number(authState.user.id) === Number(post.created_by)}
            <button onclick={() => postState.removePost(communityIdInt, post.id)} class="btn btn-sm preset-outlined-error-500">Remove</button>
          {/if}
        </div>
      {/if}
    </li>
  {/each}
</ul>