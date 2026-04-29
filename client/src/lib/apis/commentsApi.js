import { PUBLIC_API_URL } from "$env/static/public";
import { authFetch } from "$lib/utils/fetchUtils";

const getComments = async (communityId, postId) => {
  const response = await fetch(
    `${PUBLIC_API_URL}/api/communities/${communityId}/posts/${postId}/comments`,
  );
  return await response.json();
};

const addComment = async (communityId, postId, comment) => {
  const response = await authFetch(
    `${PUBLIC_API_URL}/api/communities/${communityId}/posts/${postId}/comments`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(comment)
    },
  );
  return await response.json();
};

const deleteComment = async (communityId, postId, commentId) => {
  const response = await authFetch(
    `${PUBLIC_API_URL}/api/communities/${communityId}/posts/${postId}/comments/${commentId}`, 
    {
      method: "DELETE",
    },
  );
  return await response.json();
};

const upvoteComment = async (communityId, postId, commentId) => {
  const response = await authFetch(
    `${PUBLIC_API_URL}/api/communities/${communityId}/posts/${postId}/comments/${commentId}/upvote`, 
    {
      method: "POST",
    },
  );
  return await response.json();
};

const downvoteComment = async (communityId, postId, commentId) => {
  const response = await authFetch(
    `${PUBLIC_API_URL}/api/communities/${communityId}/posts/${postId}/comments/${commentId}/downvote`, 
    {
      method: "POST",
    },
  );
  return await response.json();
};

export {
  addComment,
  deleteComment,
  getComments,
  upvoteComment,
  downvoteComment,
};