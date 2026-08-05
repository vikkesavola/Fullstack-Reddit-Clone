import { browser } from "$app/environment";
import * as commentsApi from "$lib/apis/commentsApi.js";

let commentState = $state({});

const initComments = async (communityId, postId) => {
  if (!browser) return;
  commentState[postId] = await commentsApi.getComments(communityId, postId);
};

const useCommentState = () => {
  return {
    get comments() {
      return commentState;
    },
    addComment(communityId, postId, comment) {
      commentsApi.addComment(communityId, postId, comment).then((newComment) => {
        const comments = commentState[postId] || [];
        // Newest-first, matching the server's ORDER BY created_at DESC.
        commentState[postId] = [newComment, ...comments];
      });
    },
    removeComment(communityId, postId, commentId) {
      commentsApi.deleteComment(communityId, postId, commentId).then((removedComment) => {
        commentState[postId] = commentState[postId].filter((c) => c.id != parseInt(commentId));
      });
    },
    upvoteComment(communityId, postId, commentId) {
      const list = commentState[postId] || [];
      const current = list.find((c) => c.id === commentId);
      const nextVote = current?.userVote === "upvote" ? null : "upvote";
      commentsApi.upvoteComment(communityId, postId, commentId).then((upvotedComment) => {
        commentState[postId] = list.map((c) =>
          c.id === commentId ? { ...upvotedComment, userVote: nextVote } : c
        )
      });
    },
    downvoteComment(communityId, postId, commentId) {
      const list = commentState[postId] || [];
      const current = list.find((c) => c.id === commentId);
      const nextVote = current?.userVote === "downvote" ? null : "downvote";
      commentsApi.downvoteComment(communityId, postId, commentId).then((downvotedComment) => {
        commentState[postId] = list.map((c) =>
          c.id === commentId ? { ...downvotedComment, userVote: nextVote } : c
        )
      });
    },
  };
};

export { useCommentState, initComments };