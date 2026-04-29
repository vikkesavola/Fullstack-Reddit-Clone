<script>
  import {useHomepageState} from "$lib/states/homePageState.svelte.js";
  let homepageState = useHomepageState();
</script>

<ul>
  {#each homepageState.posts as post}
    <li class="bg-tertiary-200 my-8 p-5">
      <a href="/communities/{post.community_id}/posts/{post.id}" class="text-2xl inline-block mb-2 anchor">{post.title}</a>
      <p class="mb-4">{post.content}</p>
      <div>
        <span>Upvotes: {post.upvotes}</span>
        <span>Downvotes: {post.downvotes}</span><br>
      </div>
      <span>Comments: {post.comments}</span>
    </li>
  {/each}
</ul>