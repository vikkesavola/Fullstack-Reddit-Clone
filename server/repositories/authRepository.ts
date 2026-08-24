import sql from "../database.ts";

interface User {
  username: string,
  email: string,
  password_hash: string
}

const create = async (user: User) => {
  const result = await sql`
    INSERT INTO users (email, password_hash,  username)
    VALUES (${user.email}, ${user.password_hash}, ${user.username})
    RETURNING id, email;
  `;
  return result[0];
};

const findByEmail = async (email: string) => {
  const result = await sql`
    SELECT * FROM users
      WHERE lower(trim(email)) = lower(trim(${email}))
  `;
  return result[0];
};

export { create, findByEmail };