import { PUBLIC_API_URL } from "$env/static/public";
import { authFetch } from "$lib/utils/fetchUtils";

const getCommunities = async () => {
  const response = await fetch(`${PUBLIC_API_URL}/api/communities`);

  console.log("Palvelimen status:", response.status); 

  if (!response.ok) {
    const errorText = await response.text();
    console.log("Palvelimen vastaus (ei JSONia!):", errorText);
    return []; // Palauta tyhjä lista, ettei koko sivu kaadu
  }

  return await response.json();
};

const getCommunity = async (communityId) => {
  const response = await fetch(`${PUBLIC_API_URL}/api/communities/${communityId}`);
  return await response.json();
};

const createCommunity = async (community) => {
  const response = await authFetch(`${PUBLIC_API_URL}/api/communities`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(community),
  });

  return await response.json();
};

const deleteCommunity = async (communityId) => {
  const response = await authFetch(`${PUBLIC_API_URL}/api/communities/${communityId}`, {
    method: "DELETE",
  });

  return await response.json();
};

export { getCommunity, deleteCommunity, getCommunities, createCommunity };