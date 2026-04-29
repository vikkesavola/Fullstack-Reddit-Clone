<script >
  import {usePostState} from "$lib/states/postState.svelte.js";
  let postState = usePostState();
  import { useAuthState } from "$lib/states/authState.svelte.js";
  let authState = useAuthState();

  let { communityId } = $props();
  let communityIdInt = $derived(parseInt(communityId));
  let currentPosts = $derived(postState.posts[communityIdInt] || []);
</script>

<ul>
  {#each currentPosts as post}
    <li class="bg-tertiary-200 my-8 p-5">
      <h2 class="text-xl">
        <a href="/communities/{communityIdInt}/posts/{post.id}" class="anchor">{post.title}</a>
      </h2>
      <p>{post.content}</p><br/>
      <span>Upvotes: {post.upvotes}</span><br/>
      <span>Downvotes: {post.downvotes}</span><br/>
      {#if authState.user}
        <button onclick={() => postState.upvotePost(communityId, post.id)} class="btn btn-sm preset-filled-success-500 border-1">Upvote</button>
        <button onclick={() => postState.downvotePost(communityId, post.id)} class="btn btn-sm preset-filled-error-500 border-1">Downvote</button>
        <br/>
        <br/>
      {/if}
      {#if authState.user && Number(authState.user.id) === Number(post.created_by)}
        <button onclick={() => postState.removePost(communityIdInt, post.id)} class="btn btn-sm preset-tonal-error border-1">Remove</button>
      {/if}
    </li>
  {/each}
</ul>