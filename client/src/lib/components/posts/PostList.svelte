<script >
  import {usePostState} from "$lib/states/postState.svelte.js";
  let postState = usePostState();
  import { useAuthState } from "$lib/states/authState.svelte.js";
  let authState = useAuthState();
  import VoteControl from "$lib/components/VoteControl.svelte";

  let { communityId } = $props();
  let communityIdInt = $derived(parseInt(communityId));
  let currentPosts = $derived(postState.posts[communityIdInt] || []);
</script>

<ul class="space-y-3">
  {#each currentPosts as post}
    <li class="card space-y-3">
      <span class="text-sm font-medium text-gray-500">{post.author}</span>
      <h2 class="text-xl font-semibold">
        <a href="/communities/{communityIdInt}/posts/{post.id}" class="text-gray-900 hover:underline">{post.title}</a>
      </h2>
      <p class="text-gray-700 whitespace-pre-wrap wrap-break-word">{post.content}</p>
      <div class="flex items-center gap-3">
        <VoteControl
          score={post.upvotes - post.downvotes}
          userVote={post.userVote}
          disabled={!authState.user}
          onUp={() => postState.upvotePost(communityId, post.id)}
          onDown={() => postState.downvotePost(communityId, post.id)}
        />
        {#if authState.user && Number(authState.user.id) === Number(post.created_by)}
          <button onclick={() => postState.removePost(communityIdInt, post.id)} class="btn btn-sm btn-danger">Remove</button>
        {/if}
      </div>
    </li>
  {/each}
</ul>