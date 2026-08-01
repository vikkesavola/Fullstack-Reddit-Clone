<script >
  import {usePostState} from "$lib/states/postState.svelte.js";
  let postState = usePostState();
  import { useAuthState } from "$lib/states/authState.svelte.js";
  let authState = useAuthState();

  let { communityId } = $props();
  let communityIdInt = $derived(parseInt(communityId));
  let currentPosts = $derived(postState.posts[communityIdInt] || []);
</script>

<ul class="space-y-3">
  {#each currentPosts as post}
    <li class="card space-y-3">
      <h2 class="text-xl font-semibold">
        <a href="/communities/{communityIdInt}/posts/{post.id}" class="text-gray-900 hover:underline">{post.title}</a>
      </h2>
      <p class="text-gray-700 whitespace-pre-wrap break-words">{post.content}</p>
      <div class="flex gap-4 text-sm text-gray-500">
        <span>Upvotes: {post.upvotes}</span>
        <span>Downvotes: {post.downvotes}</span>
      </div>
      {#if authState.user}
        <div class="flex flex-wrap gap-2">
          <button onclick={() => postState.upvotePost(communityId, post.id)} class="btn btn-sm btn-success">Upvote</button>
          <button onclick={() => postState.downvotePost(communityId, post.id)} class="btn btn-sm btn-secondary">Downvote</button>
          {#if Number(authState.user.id) === Number(post.created_by)}
            <button onclick={() => postState.removePost(communityIdInt, post.id)} class="btn btn-sm btn-danger">Remove</button>
          {/if}
        </div>
      {/if}
    </li>
  {/each}
</ul>