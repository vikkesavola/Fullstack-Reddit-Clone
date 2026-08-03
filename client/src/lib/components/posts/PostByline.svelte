<script>
  let { author, communityId, communityName } = $props();
</script>

<div class="text-sm text-gray-500">
  {#if communityName}
    <a href="/communities/{communityId}" class="font-medium text-gray-700 hover:underline">{communityName}</a>
    <span class="mx-1.5 text-gray-300">|</span>
  {/if}
  <span>Posted by <span class="font-medium text-gray-700">{author}</span></span>
</div>
