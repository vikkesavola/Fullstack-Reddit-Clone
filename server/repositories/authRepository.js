import postgres from "postgres";

const sql = postgres();

const create = async (user) => {
  const result = await sql`
    INSERT INTO users (email, password_hash)
    VALUES (${user.email}, ${user.password_hash})
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