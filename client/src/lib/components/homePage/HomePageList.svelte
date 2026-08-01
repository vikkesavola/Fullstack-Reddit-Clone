<script>
  import {useHomepageState} from "$lib/states/homePageState.svelte.js";
  let homepageState = useHomepageState();
</script>

<ul class="space-y-3">
  {#each homepageState.posts as post}
    <li class="card">
      <a href="/communities/{post.community_id}/posts/{post.id}" class="text-xl font-semibold text-gray-900 hover:underline">{post.title}</a>
      <p class="mt-1 mb-3 text-gray-700">{post.content}</p>
      <div class="flex gap-4 text-sm text-gray-500">
        <span>Upvotes: {post.upvotes}</span>
        <span>Downvotes: {post.downvotes}</span>
      </div>
    </li>
  {/each}
</ul>