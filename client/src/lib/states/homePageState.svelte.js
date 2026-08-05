import { browser } from "$app/environment";
import * as postsApi from "$lib/apis/postsApi.js";

let homepageState = $state([]);
let isLoading = $state(true);

const initHomepage = async (communityId) => {
  if (!browser) return;
  isLoading = true;
  homepageState = await postsApi.getHomepagePosts();
  isLoading = false;
};

const useHomepageState = () => {
  return {
    get posts() {
      return homepageState
    },
    get loading() {
      return isLoading;
    },
    updatePost(updatedPost) {
      homepageState = homepageState.map((p) =>
        p.id === updatedPost.id ? updatedPost : p
      );
    }
  };
};

export { initHomepage, useHomepageState };