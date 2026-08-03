import sql from "../database.js";

const findAll = async (communityId, userId) => {
  const result = await sql`
    SELECT posts.*, users.username AS author, communities.name AS community_name,
           user_vote.vote AS "userVote"
    FROM posts
    JOIN users ON users.id = posts.created_by
    JOIN communities ON communities.id = posts.community_id
    LEFT JOIN votes AS user_vote
      ON user_vote.post_id = posts.id AND user_vote.user_id = ${userId}
    WHERE posts.community_id = ${communityId}
      AND posts.parent_post_id IS NULL
    ORDER BY posts.created_at DESC;`;
  return result;
};

const findOne = async (communityId, postId, userId) => {
  const result = await sql`
    SELECT posts.*, users.username AS author, communities.name AS community_name,
           user_vote.vote AS "userVote"
    FROM posts
    JOIN users ON users.id = posts.created_by
    JOIN communities ON communities.id = posts.community_id
    LEFT JOIN votes AS user_vote
      ON user_vote.post_id = posts.id AND user_vote.user_id = ${userId}
    WHERE posts.id = ${postId}
      AND posts.community_id = ${communityId};`;
  return result[0];
};

const create = async (userId, communityId, post) => {
  const result = await sql `INSERT INTO posts
    (community_id, title, content, created_by)
    VALUES (${communityId}, ${post.title}, ${post.content}, ${userId})
    RETURNING *;`;
  return result[0];
};

const deleteOne = async (userId, communityId, postId) => {
  const result = await sql `DELETE FROM posts
    WHERE community_id = ${communityId} 
      AND id = ${postId} 
      AND created_by = ${userId}
    RETURNING *;`;
  return result[0];
};

const getUpvotes = async (postId) => {
  const result = await sql`SELECT count(*) FROM votes WHERE post_id = ${postId} AND vote = 'upvote'`;
  return Number(result[0].count)
}

const getDownvotes = async (postId) => {
  const result = await sql`SELECT count(*) FROM votes WHERE post_id = ${postId} AND vote = 'downvote'`;
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

const getHomepagePosts = async (userId) => {
  const result = await sql`
    SELECT
      posts.*,
      users.username AS author,
      communities.name AS community_name,
      (SELECT COUNT(*) FROM votes WHERE post_id = posts.id AND vote = 'upvote')::int AS upvotes,
      (SELECT COUNT(*) FROM votes WHERE post_id = posts.id AND vote = 'downvote')::int AS downvotes,
      (SELECT COUNT(*) FROM posts AS comments WHERE comments.parent_post_id = posts.id)::int AS comments,
      (SELECT vote FROM votes WHERE post_id = posts.id AND user_id = ${userId}) AS "userVote"
    FROM posts
    JOIN users ON users.id = posts.created_by
    JOIN communities ON communities.id = posts.community_id
    WHERE posts.created_at >= NOW() - INTERVAL '3 days'
      AND posts.parent_post_id IS NULL
    ORDER BY posts.created_at DESC;
  `;
  return result;
};

export { findAll, findOne, create, deleteOne, getUpvotes, getDownvotes, upvote, downvote, getHomepagePosts };