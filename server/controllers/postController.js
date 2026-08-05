import * as postRepository from "../repositories/postRepository.js";

const findAll = async (c) => {
  const user = c.get("user");
  const communityId = await c.req.param("communityId");
  const posts = await postRepository.findAll(communityId, user?.id ?? null);

  return c.json(posts);
};

const findOne = async (c) => {
  const user = c.get("user");
  const communityId = await c.req.param("communityId");
  const postId = await c.req.param("postId");
  const post = await postRepository.findOne(communityId, postId, user?.id ?? null);

  return c.json(post);
};

const create = async (c) => {
  const user = c.get("user");
  const communityId = await c.req.param("communityId");
  const post = await c.req.json();
  const newPost = await postRepository.create(user.id, communityId, post);

  // Refetch so the new post has the same shape as the list/detail views
  // (author, community_name, userVote). It's brand new, so counts are 0.
  const created = await postRepository.findOne(communityId, newPost.id, user.id);
  const response = { ...created, upvotes: 0, downvotes: 0 };

  return c.json(response);
};

const deleteOne = async (c) => {
  const user = c.get("user");
  const communityId = await c.req.param("communityId");
  const postId = await c.req.param("postId");
  const deletedPost = await postRepository.deleteOne(user.id, communityId, postId);
  return c.json(deletedPost);
};

const upvote = async (c) => {
  const user = c.get("user");
  const postId = await c.req.param("postId");
  const communityId = await c.req.param("communityId");
  await postRepository.upvote(user.id, postId);

  const upvotedPost = await postRepository.findOne(communityId, postId, user.id);

  return c.json(upvotedPost);
};

const downvote = async (c) => {
  const user = c.get("user");
  const postId = await c.req.param("postId");
  const communityId = await c.req.param("communityId");
  await postRepository.downvote(user.id, postId);

  const downvotedPost = await postRepository.findOne(communityId, postId, user.id);

  return c.json(downvotedPost);
};

const getHomepagePosts = async (c) => {
  const user = c.get("user");
  const homepageContent = await postRepository.getHomepagePosts(user?.id ?? null);
  return c.json(homepageContent);
};


export { findAll, findOne, create, deleteOne, upvote, downvote, getHomepagePosts };