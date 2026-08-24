import * as jwt from "@hono/hono/jwt";
import type { Context, Next } from "@hono/hono";


const JWT_SECRET = Deno.env.get("JWT_SECRET") || "jwt_secret";

const authenticate = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Missing or invalid authorization header" }, 401);
  }

  // Drop the "Bearer " prefix to get the token
  const token = authHeader.substring(7);

  try {
    const payload = await jwt.verify(token, JWT_SECRET);
    c.set("user", payload);
    await next();
  } catch (error) {
    return c.json({ error: "Invalid or expired token" }, 401);
  }
};

// For public routes that still want to personalize the response when the
// visitor happens to be logged in (e.g. showing which way they voted).
// Attaches the user if a valid token is present; never rejects anyone.
const identify = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const payload = await jwt.verify(authHeader.substring(7), JWT_SECRET);
      c.set("user", payload);
    } catch {
      // Ignore a bad/expired token: the request continues as anonymous.
    }
  }

  await next();
};

export { authenticate, identify };