<script>
  import { usePostState } from "$lib/states/postState.svelte";
  let postState = usePostState();
  
  let { communityId, postId } = $props();
  
  let post = $derived(postState.posts[communityId]?.find((p) => p.id === parseInt(postId)));

</script>

<div>
  <span>{post?.author}</span>
  <h1 class="text-2xl font-bold">{post ? post.title : "Loading..."}</h1>
  <p class="mt-2 text-gray-700 whitespace-pre-wrap wrap-break-word">{post ? post.content : "Loading..."}</p>
</div>