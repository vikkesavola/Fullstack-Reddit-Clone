<script>
  let { score = 0, userVote = null, disabled = false, onUp = () => {}, onDown = () => {} } = $props();
</script>

<div class="inline-flex items-center gap-0.5 rounded-full border border-gray-200 bg-gray-50 px-1 py-0.5">
  <button
    type="button"
    onclick={onUp}
    {disabled}
    aria-label="Upvote"
    aria-pressed={userVote === "upvote"}
    class="flex h-7 w-7 items-center justify-center rounded-full hover:bg-blue-100 disabled:cursor-not-allowed disabled:hover:bg-transparent {userVote === 'upvote' ? 'text-blue-600' : 'text-gray-400'}"
  >
    <svg viewBox="0 0 20 20" class="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M10 4l7 9H3z" />
    </svg>
  </button>

  <span
    class="min-w-[2ch] text-center text-sm font-semibold tabular-nums {userVote === 'upvote'
      ? 'text-blue-600'
      : userVote === 'downvote'
        ? 'text-amber-600'
        : 'text-gray-700'}"
  >
    {score}
  </span>

  <button
    type="button"
    onclick={onDown}
    {disabled}
    aria-label="Downvote"
    aria-pressed={userVote === "downvote"}
    class="flex h-7 w-7 items-center justify-center rounded-full hover:bg-amber-100 disabled:cursor-not-allowed disabled:hover:bg-transparent {userVote === 'downvote' ? 'text-amber-600' : 'text-gray-400'}"
  >
    <svg viewBox="0 0 20 20" class="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M10 16l-7-9h14z" />
    </svg>
  </button>
</div>
