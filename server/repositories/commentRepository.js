import sql from "../database.js";

const findAll = async (postId) => {
  const result = await sql `
    SELECT posts.*, users.username AS author
    FROM posts
    JOIN users ON users.id = posts.created_by
    WHERE parent_post_id = ${postId};`;
  return result;
};

const findOne = async (postId, commentId) => {
  const result = await sql `
  SELECT posts.*, users.username AS author
  FROM posts
  JOIN users ON users.id = posts.created_by
  WHERE parent_post_id = ${postId}
    AND id = ${commentId};`;
  return result[0];
};

const create = async (userId, communityId, postId, content) => {
  const result = await sql `INSERT INTO posts
    (community_id, content, parent_post_id, created_by)
    VALUES (${communityId}, ${content.content}, ${postId}, ${userId})
    RETURNING *;`;
  return result[0];
};

const deleteOne = async (userId, communityId, postId, commentId) => {
  const result = await sql `DELETE FROM posts
    WHERE community_id = ${communityId} 
      AND id = ${commentId} 
      AND parent_post_id = ${postId}
      AND created_by = ${userId}
    RETURNING *;`;
  return result[0];
};

const getUpvotes = async (commentId) => {
  const result = await sql`SELECT count(*) FROM votes WHERE post_id = ${commentId} AND vote = 'upvote'`;
  return Number(result[0].count)
}

const getDownvotes = async (commentId) => {
  const result = await sql`SELECT count(*) FROM votes WHERE post_id = ${commentId} AND vote = 'downvote'`;
  return Number(result[0].count)
}

const upvote = async (userId, postId) => {
  const existing = await sql`
    SELECT vote FROM votes WHERE user_id = ${userId} AND post_id = ${postId}`;

  // Clicking the same vote you already cast removes it (toggle off).
  if (existing.length > 0 && existing[0].vote === "upvote") {
    await sql`DELETE FROM votes WHERE user_id = ${userId} AND post_id = ${postId}`;
    return null;
  }

  const result = await sql `INSERT INTO votes
    (user_id, vote, post_id)
    VALUES (${userId}, 'upvote', ${postId})
    ON CONFLICT (user_id, post_id)
    DO UPDATE SET vote = EXCLUDED.vote
    RETURNING *;`;

  return result[0];
};

const downvote = async (userId, postId) => {
  const existing = await sql`
    SELECT vote FROM votes WHERE user_id = ${userId} AND post_id = ${postId}`;

  // Clicking the same vote you already cast removes it (toggle off).
  if (existing.length > 0 && existing[0].vote === "downvote") {
    await sql`DELETE FROM votes WHERE user_id = ${userId} AND post_id = ${postId}`;
    return null;
  }

  const result = await sql `INSERT INTO votes
    (user_id, vote, post_id)
    VALUES (${userId}, 'downvote', ${postId})
    ON CONFLICT (user_id, post_id)
    DO UPDATE SET vote = EXCLUDED.vote
    RETURNING *;`;

  return result[0];
};


export { findAll, findOne, create, deleteOne, getUpvotes, getDownvotes, upvote, downvote }