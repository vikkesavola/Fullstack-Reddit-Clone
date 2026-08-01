<script>
  import {useHomepageState} from "$lib/states/homePageState.svelte.js";
  let homepageState = useHomepageState();
</script>

<ul class="space-y-4">
  {#each homepageState.posts as post}
    <li class="border border-surface-200-800 bg-white dark:bg-surface-900 shadow-sm rounded-lg p-4">
      <a href="/communities/{post.community_id}/posts/{post.id}" class="text-2xl font-semibold inline-block mb-2 anchor">{post.title}</a>
      <p class="mb-3">{post.content}</p>
      <div class="flex gap-4 text-sm opacity-80">
        <span>Upvotes: {post.upvotes}</span>
        <span>Downvotes: {post.downvotes}</span>
      </div>
    </li>
  {/each}
</ul>