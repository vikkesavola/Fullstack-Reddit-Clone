import sql from "../database.js";

const findAll = async (postId) => {
  const result = await sql `
    SELECT posts.*, 
      users.username AS author,
      (SELECT COUNT(*) FROM votes WHERE post_id = posts.id AND vote = 'upvote')::int AS upvotes,
      (SELECT COUNT(*) FROM votes WHERE post_id = posts.id AND vote = 'downvote')::int AS downvotes
    FROM posts
    JOIN users ON users.id = posts.created_by
    WHERE parent_post_id = ${postId};`;
  return result;
};

const findOne = async (postId, commentId) => {
  const result = await sql `
  SELECT posts.*, 
    users.username AS author,
    (SELECT COUNT(*) FROM votes WHERE post_id = posts.id AND vote = 'upvote')::int AS upvotes,
    (SELECT COUNT(*) FROM votes WHERE post_id = posts.id AND vote = 'downvote')::int AS downvotes
  FROM posts
  JOIN users ON users.id = posts.created_by
  WHERE parent_post_id = ${postId}
    AND posts.id = ${commentId};`;
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


export { findAll, findOne, create, deleteOne, upvote, downvote }