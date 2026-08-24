import sql from "../database.ts";

interface Community {
  id: number,
  name: string,
  description: string,
  created_by: number,
  created_at: Date
}

const findAll = async (): Promise<Community[]> => {
  return await sql<Community[]>`SELECT * FROM communities`;
};

const findOne = async (communityId: string): Promise<Community> => {
  const result = await sql<Community[]>`SELECT * FROM communities
    WHERE id = ${communityId}`;
  return result[0];
};

const create = async (community: Community, userId: number): Promise<Community> => {
  const result = await sql<Community[]>`INSERT INTO communities
    (name, description, created_by)
    VALUES (${community.name}, ${community.description}, ${userId})
    RETURNING *;`;
  return result[0];
};

const deleteOne = async (communityId: string, userId: number): Promise<Community> => {
  const result = await sql<Community[]>`DELETE FROM communities
    WHERE id = ${communityId} AND created_by = ${userId}
    RETURNING *;`;
  return result[0];
};

export { findAll, findOne, create, deleteOne };