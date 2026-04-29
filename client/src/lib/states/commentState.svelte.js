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
        comments.push(newComment);
        commentState[postId] = comments;
      });
    },
    removeComment(communityId, postId, commentId) {
      commentsApi.deleteComment(communityId, postId, commentId).then((removedComment) => {
        commentState[postId] = commentState[postId].filter((c) => c.id != parseInt(commentId));
      });
    },
    upvoteComment(communityId, postId, commentId) {
      commentsApi.upvoteComment(communityId, postId, commentId).then((upvotedComment) => {
        commentState[postId] = commentState[postId].map((c) =>
          c.id === commentId ? upvotedComment : c
        )
      });
    },
    downvoteComment(communityId, postId, commentId) {
      commentsApi.downvoteComment(communityId, postId, commentId).then((downvotedComment) => {
        commentState[postId] = commentState[postId].map((c) =>
          c.id === commentId ? downvotedComment : c
        )
      });
    },
  };
};

export { useCommentState, initComments };