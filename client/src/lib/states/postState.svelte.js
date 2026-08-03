import { browser } from "$app/environment";
import * as postsApi from "$lib/apis/postsApi.js";
import { useAuthState } from "$lib/states/authState.svelte.js";
import { goto } from "$app/navigation";
const authState = useAuthState();

let postState = $state({});

const initPosts = async (communityId) => {
  if (!browser) return;
  postState[communityId] = await postsApi.getPosts(communityId);
};

const initPost = async (communityId, postId) => {
  if (!browser) return;
  const post = await postsApi.getPost(communityId, postId);
  
  if (!postState[communityId]) {
    postState[communityId] = [];
  }
  
  const index = postState[communityId].findIndex((p) => p.id === parseInt(postId));
  if (index !== -1) {
    postState[communityId][index] = post;
  } else {
    postState[communityId] = [...postState[communityId], post];
  }
};

const usePostState = () => {
  return {
    get posts() {
      return postState;
    },
    addPost(communityId, post) {
      postsApi.addPost(communityId, post).then((newPost) => {
        const posts = postState[communityId] || [];
        // Newest-first, matching the server's ORDER BY created_at DESC.
        postState[communityId] = [newPost, ...posts];
      });
    },
    removePost(communityId, postId) {
      postsApi.deletePost(communityId, postId).then((removedPost) => {
        postState[communityId] = postState[communityId].filter((p) => p.id != parseInt(postId));//.map((p, i) => ({ ...p, id: i + 1 }));
      });
    },
    upvotePost(communityId, postId) {
      if (!authState.user) {
        goto("/auth/login");
        return Promise.resolve(null);
      }

      const list = postState[communityId] || [];
      // The server response already carries the authoritative userVote.
      return postsApi.upvotePost(communityId, postId).then((upvotedPost) => {
        postState[communityId] = list.map((p) =>
          p.id === parseInt(postId) ? upvotedPost : p
        );
        return upvotedPost;
      });
    },
    downvotePost(communityId, postId) {
      if (!authState.user) {
        goto("/auth/login");
        return Promise.resolve(null);
      }

      const list = postState[communityId] || [];
      return postsApi.downvotePost(communityId, postId).then((downvotedPost) => {
        postState[communityId] = list.map((p) =>
          p.id === parseInt(postId) ? downvotedPost : p
        );
        return downvotedPost;
      });
    }
  };
};

export { usePostState, initPosts, initPost };