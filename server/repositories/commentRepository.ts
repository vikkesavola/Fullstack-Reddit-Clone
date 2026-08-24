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

// A comment as the read queries return it: the row + joined/computed fields
interface CommentView extends PostRow {
  author: string;
  upvotes: number;
  downvotes: number;
}

interface Vote {
  user_id: number;
  post_id: number;
  vote: "upvote" | "downvote";
  created_at: Date;
}

const findAll = async (postId: string): Promise<CommentView[]> => {
  const result = await sql<CommentView[]>`
    SELECT posts.*, 
      users.username AS author,
      (SELECT COUNT(*) FROM votes WHERE post_id = posts.id AND vote = 'upvote')::int AS upvotes,
      (SELECT COUNT(*) FROM votes WHERE post_id = posts.id AND vote = 'downvote')::int AS downvotes
    FROM posts
    JOIN users ON users.id = posts.created_by
    WHERE parent_post_id = ${postId}
    ORDER BY posts.created_at DESC;`;
  return result;
};

const findOne = async (postId: string, commentId: string): Promise<CommentView | undefined> => {
  const result = await sql<CommentView[]>`
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

const create = async (userId: number, communityId: string, postId: string, content: {content: string}): Promise<PostRow> => {
  const result = await sql<PostRow[]>`INSERT INTO posts
    (community_id, content, parent_post_id, created_by)
    VALUES (${communityId}, ${content.content}, ${postId}, ${userId})
    RETURNING *;`;
  return result[0];
};

const deleteOne = async (userId: number, communityId: string, postId:string, commentId: string): Promise<PostRow> => {
  const result = await sql<PostRow[]>`DELETE FROM posts
    WHERE community_id = ${communityId} 
      AND id = ${commentId} 
      AND parent_post_id = ${postId}
      AND created_by = ${userId}
    RETURNING *;`;
  return result[0];
};

const upvote = async (userId: number, postId: string): Promise<Vote | null> => {
  const existing = await sql<Pick<Vote, "vote">[]>`
    SELECT vote FROM votes WHERE user_id = ${userId} AND post_id = ${postId}`;

  // Vote toggle off
  if (existing.length > 0 && existing[0].vote === "upvote") {
    await sql `DELETE FROM votes WHERE user_id = ${userId} AND post_id = ${postId}`;
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

const downvote = async (userId: number, postId: string): Promise<Vote | null> => {
  const existing = await sql<Pick<Vote, "vote">[]>`
    SELECT vote FROM votes WHERE user_id = ${userId} AND post_id = ${postId}`;

  // Vote toggle off
  if (existing.length > 0 && existing[0].vote === "downvote") {
    await sql `DELETE FROM votes WHERE user_id = ${userId} AND post_id = ${postId}`;
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


export { findAll, findOne, create, deleteOne, upvote, downvote }