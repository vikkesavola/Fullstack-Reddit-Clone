import type { Context } from "@hono/hono";
import * as commentRepository from "../repositories/commentRepository.ts";

const findAll = async (c: Context) => {
  const postId = c.req.param("postId");
  const comments = await commentRepository.findAll(postId);

  return c.json(comments);
};

const create = async (c: Context) => {
  const user = c.get("user");
  const communityId = c.req.param("communityId");
  const postId = c.req.param("postId");
  const content = await c.req.json();
  const newComment = await commentRepository.create(user.id, communityId, postId, content);
  
  const response = {
    ...newComment,
    author: user.username,
    upvotes: 0,
    downvotes: 0,
  };

  return c.json(response);
};

const deleteOne = async (c: Context) => {
  const user = c.get("user");
  const communityId = c.req.param("communityId");
  const postId = c.req.param("postId");
  const commentId = c.req.param("commentId");
  const deletedComment = await commentRepository.deleteOne(user.id, communityId, postId, commentId);
  return c.json(deletedComment);
};

const upvote = async (c: Context) => {
  const user = c.get("user");
  const postId = c.req.param("postId");
  const commentId = c.req.param("commentId");
  await commentRepository.upvote(user.id, commentId);

  const upvotedComment = await commentRepository.findOne(postId, commentId);

  return c.json(upvotedComment);
};

const downvote = async (c: Context) => {
  const user = c.get("user");
  const postId = await c.req.param("postId");
  const commentId = c.req.param("commentId");
  await commentRepository.downvote(user.id, commentId);

  const downvotedComment = await commentRepository.findOne(postId, commentId);

  return c.json(downvotedComment);
};

export { findAll, create, deleteOne, upvote, downvote };