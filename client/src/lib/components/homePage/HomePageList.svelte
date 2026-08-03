<script>
  import {useHomepageState} from "$lib/states/homePageState.svelte.js";
  import VoteControl from "$lib/components/VoteControl.svelte";
  import { usePostState } from "$lib/states/postState.svelte";
  let homepageState = useHomepageState();
  let postState = usePostState();

  let postList = $derived(homepageState.posts);
</script>

<ul class="space-y-3">
  {#each postList as post}
    <li class="card">
      <a href="/communities/{post.community_id}/posts/{post.id}" class="text-xl font-semibold text-gray-900 hover:underline">{post.title}</a>
      <p class="mt-1 mb-3 text-gray-700 whitespace-pre-wrap wrap-break-word">{post.content}</p>
      <VoteControl
        score={post.upvotes - post.downvotes}
        userVote={post.userVote}
        disabled={false}
        onUp={async () => {
          const updatedPost = await postState.upvotePost(post.community_id, post.id);
          if (updatedPost) {
            homepageState.updatePost(updatedPost);
          }
        }}
        onDown={async () => {
          const updatedPost = await postState.downvotePost(post.community_id, post.id);
          
          if (updatedPost) {
            homepageState.updatePost(updatedPost);
          }
        }}
      />
    </li>
  {/each}
</ul>