<script>
  import { usePostState } from "$lib/states/postState.svelte";
  let postState = usePostState();
  
  let { communityId, postId } = $props();
  
  let post = $derived(postState.posts[communityId]?.find((p) => p.id === parseInt(postId)));

</script>

<h1 class="text-3xl my-4">{post ? post.title : "Loading..."}</h1>
<p class="text-lg">{post ? post.content : "Loading..."}</p>