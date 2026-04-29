import { browser } from "$app/environment";
import * as authApi from "$lib/apis/authApi.js";

const USER_KEY = "user";
const TOKEN_KEY = "token";

let user = $state(null);
let token = $state(null);

if (browser) {
  const storedUser = localStorage.getItem(USER_KEY);
  const storedToken = localStorage.getItem(TOKEN_KEY);

  if (storedUser) {
    user = JSON.parse(storedUser);
  }
  if (storedToken) {
    token = storedToken;
  }
}

const useAuthState = () => {
  return {
    get user() {
      return user;
    },
    get token() {
      return token;
    },
    login: async (email, password) => {
      const response = await authApi.login({ email, password });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      user = data.user;
      token = data.token;

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      return data;
    },
    register: async (email, password) => {
      const response = await authApi.register({ email, password });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      return await response.json();
    },
    logout: () => {
      user = null;
      token = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  };
};

export { useAuthState };