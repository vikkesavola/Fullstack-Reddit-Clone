import sql from "../database.ts";

// The posts table (both posts and comments)
interface PostRow {
  id: number;
  community_id: number;
  parent_post_id: number | null;   // null for posts
  created_by: number;
  title: string | null;            // null for comments
  content: string;
  created_at: Date;
}

interface PostView extends PostRow {
  author: string;
  community_name: string;
  userVote: "upvote" | "downvote" | null;
  upvotes: number;
  downvotes: number;
}

interface Vote {
  user_id: number;
  post_id: number;
  vote: "upvote" | "downvote";
  created_at: Date;
}

const findAll = async (communityId: number, userId: number | null): Promise<PostView[]> => {
  const result = await sql<PostView[]>`
    SELECT 
      posts.*, 
      users.username AS author, 
      communities.name AS community_name,
      user_vote.vote AS "userVote",
      (SELECT COUNT(*) FROM votes WHERE post_id = posts.id AND vote = 'upvote')::int AS upvotes,
      (SELECT COUNT(*) FROM votes WHERE post_id = posts.id AND vote = 'downvote')::int AS downvotes
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

const findOne = async (communityId: number, postId: number, userId: number | null): Promise<PostView | undefined> => {
  const result = await sql<PostView[]>`
    SELECT posts.*, 
      users.username AS author, 
      communities.name AS community_name,
      user_vote.vote AS "userVote",
      (SELECT COUNT(*) FROM votes WHERE post_id = posts.id AND vote = 'upvote')::int AS upvotes,
      (SELECT COUNT(*) FROM votes WHERE post_id = posts.id AND vote = 'downvote')::int AS downvotes
    FROM posts
    JOIN users ON users.id = posts.created_by
    JOIN communities ON communities.id = posts.community_id
    LEFT JOIN votes AS user_vote
      ON user_vote.post_id = posts.id AND user_vote.user_id = ${userId}
    WHERE posts.id = ${postId}
      AND posts.community_id = ${communityId};`;
  return result[0];
};

const create = async (userId: number, communityId: number, post: Pick<PostRow, "title" | "content">): Promise<PostRow> => {
  const result = await sql<PostRow[]>`INSERT INTO posts
    (community_id, title, content, created_by)
    VALUES (${communityId}, ${post.title}, ${post.content}, ${userId})
    RETURNING *;`;
  return result[0];
};

const deleteOne = async (userId: number, communityId: number, postId: number): Promise<PostRow | undefined> => {
  const result = await sql<PostRow[]>`DELETE FROM posts
    WHERE community_id = ${communityId} 
      AND id = ${postId} 
      AND created_by = ${userId}
    RETURNING *;`;
  return result[0];
};

const upvote = async (userId: number, postId: number): Promise<Vote | null> => {
  const existing = await sql<Pick<Vote, "vote">[]>`
    SELECT vote FROM votes WHERE user_id = ${userId} AND post_id = ${postId}`;

  // Vote toggle off
  if (existing.length > 0 && existing[0].vote === "upvote") {
    await sql`DELETE FROM votes WHERE user_id = ${userId} AND post_id = ${postId}`;
    return null;
  }

  const result = await sql<Vote[]>`INSERT INTO votes
    (user_id, vote, post_id)
    VALUES (${userId}, 'upvote', ${postId})
    ON CONFLICT (user_id, post_id)
    DO UPDATE SET vote = EXCLUDED.vote
    RETURNING *;`;

  return result[0];
};

const downvote = async (userId: number, postId: number): Promise<Vote | null> => {
  const existing = await sql<Pick<Vote, "vote">[]>`
    SELECT vote FROM votes WHERE user_id = ${userId} AND post_id = ${postId}`;

  // Vote toggle off
  if (existing.length > 0 && existing[0].vote === "downvote") {
    await sql`DELETE FROM votes WHERE user_id = ${userId} AND post_id = ${postId}`;
    return null;
  }

  const result = await sql<Vote[]>`INSERT INTO votes
    (user_id, vote, post_id)
    VALUES (${userId}, 'downvote', ${postId})
    ON CONFLICT (user_id, post_id)
    DO UPDATE SET vote = EXCLUDED.vote
    RETURNING *;`;

  return result[0];
};

interface HomepagePost extends PostView { comments: number; }

const getHomepagePosts = async (userId: number | null): Promise<HomepagePost[]> => {
  const result = await sql<HomepagePost[]>`
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
    -- no time window: demo data shouldn't age off the homepage
    WHERE posts.parent_post_id IS NULL
    ORDER BY posts.created_at DESC;
  `;
  return result;
};

export { findAll, findOne, create, deleteOne, upvote, downvote, getHomepagePosts };