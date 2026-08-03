<script>
  import {useHomepageState} from "$lib/states/homePageState.svelte.js";
  import VoteControl from "$lib/components/VoteControl.svelte";
  let homepageState = useHomepageState();
</script>

<ul class="space-y-3">
  {#each homepageState.posts as post}
    <li class="card">
      <a href="/communities/{post.community_id}/posts/{post.id}" class="text-xl font-semibold text-gray-900 hover:underline">{post.title}</a>
      <p class="mt-1 mb-3 text-gray-700 whitespace-pre-wrap break-words">{post.content}</p>
      <VoteControl score={post.upvotes - post.downvotes} disabled={true} />
    </li>
  {/each}
</ul>