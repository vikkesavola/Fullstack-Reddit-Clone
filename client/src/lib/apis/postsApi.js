import { PUBLIC_API_URL } from "$env/static/public";
import { authFetch } from "$lib/utils/fetchUtils";

const getPosts = async (communityId) => {
  const response = await fetch(
    `${PUBLIC_API_URL}/api/communities/${communityId}/posts`,
  );
  return await response.json();
};

const getPost = async (communityId, postId) => {
  const response = await fetch(
    `${PUBLIC_API_URL}/api/communities/${communityId}/posts/${postId}`,
  );
  return await response.json();
};

const addPost = async (communityId, post) => {
  const response = await authFetch(
    `${PUBLIC_API_URL}/api/communities/${communityId}/posts`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(post)
    },
  );
  return await response.json();
};

const deletePost = async (communityId, postId) => {
  const response = await authFetch(
    `${PUBLIC_API_URL}/api/communities/${communityId}/posts/${postId}`, 
    {
      method: "DELETE",
    },
  );
  return await response.json();
};

const upvotePost = async (communityId, postId) => {
  const response = await authFetch(
    `${PUBLIC_API_URL}/api/communities/${communityId}/posts/${postId}/upvote`,
    {
      method: "POST",
    },
  );
  return await response.json();
};

const downvotePost = async (communityId, postId) => {
  const response = await authFetch(
    `${PUBLIC_API_URL}/api/communities/${communityId}/posts/${postId}/downvote`,
    {
      method: "POST",
    },
  );
  return await response.json();
};

const getHomepagePosts = async () => {
  const response = await fetch(
    `${PUBLIC_API_URL}/api/homepage`
  );
  return await response.json();
};

export {
  addPost,
  deletePost,
  getPost,
  getPosts,
  upvotePost,
  downvotePost,
  getHomepagePosts,
};