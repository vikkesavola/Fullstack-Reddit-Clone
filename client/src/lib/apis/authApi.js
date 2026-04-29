import { PUBLIC_API_URL } from "$env/static/public";

const register = async (user) => {
  return await fetch(`${PUBLIC_API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(user),
  });
};

const login = async (credentials) => {
  return await fetch(`${PUBLIC_API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(credentials)
  });
};

export { register, login };