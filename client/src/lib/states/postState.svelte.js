import { browser } from "$app/environment";
import * as postsApi from "$lib/apis/postsApi.js";

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
        posts.push(newPost);
        postState[communityId] = posts;
      });
    },
    removePost(communityId, postId) {
      postsApi.deletePost(communityId, postId).then((removedPost) => {
        postState[communityId] = postState[communityId].filter((p) => p.id != parseInt(postId));//.map((p, i) => ({ ...p, id: i + 1 }));
      });
    },
    upvotePost(communityId, postId) {
      postsApi.upvotePost(communityId, postId).then((upvotedPost) => {
        postState[communityId] = postState[communityId].map((p) =>
          p.id === parseInt(postId) ? upvotedPost : p
        )
      });
    },
    downvotePost(communityId, postId) {
      postsApi.downvotePost(communityId, postId).then((downvotedPost) => {
        postState[communityId] = postState[communityId].map((p) =>
          p.id === parseInt(postId) ? downvotedPost : p
        )
      });
    },
  };
};

export { usePostState, initPosts, initPost };