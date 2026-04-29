import postgres from "postgres";

const sql = postgres();


const findAll = async () => {
  return await sql `SELECT * FROM communities`;
};

const findOne = async (communityId) => {
  const result = await sql `SELECT * FROM communities
    WHERE id = ${communityId}`;
  return result[0];
};

const create = async (community, userId) => {
  const result = await sql `INSERT INTO communities
    (name, description, created_by)
    VALUES (${community.name}, ${community.description}, ${userId})
    RETURNING *;`;
  return result[0];
};

const deleteOne = async (communityId, userId) => {
  const result = await sql `DELETE FROM communities
    WHERE id = ${communityId} AND created_by = ${userId}
    RETURNING *;`;
  return result[0];
};

export { findAll, findOne, create, deleteOne };