import { browser } from "$app/environment";
import * as communitiesApi from "$lib/apis/communitiesApi.js";

let communityState = $state([]);

const initCommunities = async () => {
  if (browser) {
    communityState = await communitiesApi.getCommunities();
  };
};

const initCommunity = async (communityId) => {
  if (browser) {
    const community = await communitiesApi.getCommunity(communityId);
    if (community && !communityState.find((c) => c.id === communityId)) {
      communityState.push(community);
    };
  };
};

const useCommunityState = () => {
  return {
    get communities() {
      return communityState;
    },
    addCommunity(community) {
      communitiesApi.createCommunity(community).then((newCommunity) => {
        communityState.push(newCommunity);
      });
    },
    removeCommunity(communityId) {
      communitiesApi.deleteCommunity(communityId).then((removed) => {
        communityState = communityState.filter((c) => c.id != parseInt(communityId)).map((c, i) => ({ ...c, id: i + 1 }));
      });
    }
  };
};

export { useCommunityState, initCommunities, initCommunity };