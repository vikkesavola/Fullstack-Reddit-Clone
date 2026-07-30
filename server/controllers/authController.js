import * as jwt from "@hono/hono/jwt";
import { hash, verify } from "scrypt";
import * as authRepository from "../repositories/authRepository.js";

const JWT_SECRET = Deno.env.get("JWT_SECRET") || "jwt_secret";

const register = async (c) => {
  const user = await c.req.json();
  try {
    user.password_hash = hash(user.password);
    const newUser = await authRepository.create(user);
    return c.json({
      message: `Confirmation email sent to address ${newUser.email}.`
    });
  } catch (e) {
    return c.json({
      message: `Confirmation email sent to address ${user.email}.`
    })
  }
};

const login = async (c) => {
  const user = await c.req.json();
  const foundUser = await authRepository.findByEmail(user.email);
  if (!foundUser) return c.json({ message: "Incorrect email or password." }, 401);

  const isValid = verify(user.password, foundUser.password_hash);
  if (!isValid) {
    return c.json({ message: "Incorrect email or password." }, 401);
  }

  const payload = {
    id: foundUser.id,
    email: foundUser.email
  };

  const token = await jwt.sign(payload, JWT_SECRET);

  return c.json({
    message: "Login successful!",
    user: payload,
    token: token
  });
};

export { register, login }