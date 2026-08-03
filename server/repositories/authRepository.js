import sql from "../database.js";

const create = async (user) => {
  const result = await sql`
    INSERT INTO users (email, password_hash,  username)
    VALUES (${user.email}, ${user.password_hash}, ${user.username})
    RETURNING id, email;
  `;
  return result[0];
};

const findByEmail = async (email) => {
  const result = await sql`
    SELECT * FROM users
      WHERE lower(trim(email)) = lower(trim(${email}))
  `;
  return result[0];
};

export { create, findByEmail };