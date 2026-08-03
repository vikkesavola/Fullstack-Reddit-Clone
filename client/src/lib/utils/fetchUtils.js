import { browser } from "$app/environment";
import { useAuthState } from "$lib/states/authState.svelte.js";

const authState = useAuthState();

const authFetch = async (url, options = {}) => {
  if (!browser) {
    throw new Error("Authenticated fetch can only be used in the browser");
  }

  const token = authState.token;

  if (!token) {
    throw new Error("Hello anonymous!");
  }

  const headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Invalid or expired token
    authState.logout();
    window.location.href = "/auth/login";
    throw new Error("Invalid or expired token");
  }

  return response;
};

// For public GET routes: attaches the token when the visitor is logged in so
// the server can personalize the response (e.g. their own vote), but works
// perfectly well for anonymous visitors. Mirrors the server `identify` middleware.
const identifiedFetch = async (url, options = {}) => {
  const token = browser ? authState.token : null;

  const headers = { ...options.headers };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return await fetch(url, { ...options, headers });
};

export { authFetch, identifiedFetch };