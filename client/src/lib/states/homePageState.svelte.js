import { browser } from "$app/environment";
import * as postsApi from "$lib/apis/postsApi.js";

let homepageState = $state([]);

const initHomepage = async (communityId) => {
  if (!browser) return;
  homepageState = await postsApi.getHomepagePosts();
};

const useHomepageState = () => {
  return {
    get posts() {
      return homepageState
    },
    updatePost(updatedPost) {
      homepageState = homepageState.map((p) =>
        p.id === updatedPost.id ? updatedPost : p
      );
    }
  };
};

export { initHomepage, useHomepageState };