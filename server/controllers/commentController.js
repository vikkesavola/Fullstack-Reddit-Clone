import * as commentRepository from "../repositories/commentRepository.js";

const findAll = async (c) => {
  const postId = c.req.param("postId");
  const comments = await commentRepository.findAll(postId);

  const commentsWithVotes = [];

  for (const comment of comments) {
    const upvotes = await commentRepository.getUpvotes(comment.id);
    const downvotes = await commentRepository.getDownvotes(comment.id);

    commentsWithVotes.push({
      ...comment,
      upvotes: upvotes,
      downvotes: downvotes
    });
  }

  return c.json(commentsWithVotes);
};

const create = async (c) => {
  const user = c.get("user");
  const communityId = c.req.param("communityId");
  const postId = c.req.param("postId");
  const content = await c.req.json();
  const newComment = await commentRepository.create(user.id, communityId, postId, content);
  
  const response = {
    ...newComment,
    upvotes: 0,
    downvotes: 0
  }

  return c.json(response);
};

const deleteOne = async (c) => {
  const user = c.get("user");
  const communityId = c.req.param("communityId");
  const postId = c.req.param("postId");
  const commentId = c.req.param("commentId");
  const deletedComment = await commentRepository.deleteOne(user.id, communityId, postId, commentId);
  return c.json(deletedComment);
};

const upvote = async (c) => {
  const user = c.get("user");
  const communityId = await c.req.param("communityId");
  const postId = await c.req.param("postId");
  const commentId = c.req.param("commentId");
  await commentRepository.upvote(user.id, commentId);

  const upvotedComment = await commentRepository.findOne(postId, commentId);
  const upvotes = await commentRepository.getUpvotes(commentId);
  const downvotes = await commentRepository.getDownvotes(commentId);

  const response = {
    ...upvotedComment,
    upvotes: upvotes,
    downvotes: downvotes
  }

  return c.json(response);
};

const downvote = async (c) => {
  const user = c.get("user");
  const communityId = await c.req.param("communityId");
  const postId = await c.req.param("postId");
  const commentId = c.req.param("commentId");
  await commentRepository.downvote(user.id, commentId);

  const downvotedComment = await commentRepository.findOne(postId, commentId);
  const upvotes = await commentRepository.getUpvotes(commentId);
  const downvotes = await commentRepository.getDownvotes(commentId);

  const response = {
    ...downvotedComment,
    upvotes: upvotes,
    downvotes: downvotes
  }

  return c.json(response);
};

export { findAll, create, deleteOne, upvote, downvote };