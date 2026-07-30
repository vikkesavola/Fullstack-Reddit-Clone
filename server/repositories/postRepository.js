import sql from "../database.js";

const findAll = async (communityId) => {
  const result = await sql `SELECT * FROM posts
    WHERE community_id = ${communityId}
    AND posts.parent_post_id IS NULL;`;
  return result;
};

const findOne = async (communityId, postId) => {
  const result = await sql `SELECT * FROM posts
    WHERE id = ${postId}
    AND community_id = ${communityId};`;
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
  const result = await sql `INSERT INTO votes
    (user_id, vote, post_id)
    VALUES (${userId}, 'upvote', ${postId})
    ON CONFLICT (user_id, post_id) 
    DO UPDATE SET vote = EXCLUDED.vote
    RETURNING *;`;

  return result[0];
};

const downvote = async (userId, postId) => {
  const result = await sql `INSERT INTO votes
    (user_id, vote, post_id)
    VALUES (${userId}, 'downvote', ${postId})
    ON CONFLICT (user_id, post_id) 
    DO UPDATE SET vote = EXCLUDED.vote
    RETURNING *;`;

  return result[0];
};

const getHomepagePosts = async () => {
  const result = await sql`
    SELECT 
      posts.*,
      (SELECT COUNT(*) FROM votes WHERE post_id = posts.id AND vote = 'upvote')::int AS upvotes,
      (SELECT COUNT(*) FROM votes WHERE post_id = posts.id AND vote = 'downvote')::int AS downvotes,
      (SELECT COUNT(*) FROM posts AS comments WHERE comments.parent_post_id = posts.id)::int AS comments
    FROM posts
    WHERE posts.created_at >= NOW() - INTERVAL '3 days'
      AND posts.parent_post_id IS NULL
    ORDER BY posts.created_at DESC;
  `;
  return result;
};

export { findAll, findOne, create, deleteOne, getUpvotes, getDownvotes, upvote, downvote, getHomepagePosts };