import * as postRepository from "../repositories/postRepository.js";

const findAll = async (c) => {
  const communityId = await c.req.param("communityId");
  const posts = await postRepository.findAll(communityId);

  const postsWithVotes = [];

  for (const post of posts) {
    const upvotes = await postRepository.getUpvotes(post.id);
    const downvotes = await postRepository.getDownvotes(post.id);

    postsWithVotes.push({
      ...post,
      upvotes: upvotes,
      downvotes: downvotes
    });
  }

  return c.json(postsWithVotes);
};

const findOne = async (c) => {
  const communityId = await c.req.param("communityId");
  const postId = await c.req.param("postId");
  const post = await postRepository.findOne(communityId, postId);

  const upvotes = await postRepository.getUpvotes(postId);
  const downvotes = await postRepository.getDownvotes(postId);

  const response = {
    ...post,
    upvotes: upvotes,
    downvotes: downvotes
  }

  return c.json(response);
};

const create = async (c) => {
  const user = c.get("user");
  const communityId = await c.req.param("communityId");
  const post = await c.req.json();
  const newPost = await postRepository.create(user.id, communityId, post);

  const response = {
    ...newPost,
    upvotes: 0,
    downvotes: 0
  };

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

  const upvotedPost = await postRepository.findOne(communityId, postId);
  const upvotes = await postRepository.getUpvotes(postId);
  const downvotes = await postRepository.getDownvotes(postId);

  const response = {
    ...upvotedPost,
    upvotes: upvotes,
    downvotes: downvotes
  }

  return c.json(response);
};

const downvote = async (c) => {
  const user = c.get("user");
  const postId = await c.req.param("postId");
  const communityId = await c.req.param("communityId");
  await postRepository.downvote(user.id, postId);

  const downvotedPost = await postRepository.findOne(communityId, postId);
  const upvotes = await postRepository.getUpvotes(postId);
  const downvotes = await postRepository.getDownvotes(postId);

  const response = {
    ...downvotedPost,
    upvotes: upvotes,
    downvotes: downvotes
  }

  return c.json(response);
};

const getHomepagePosts = async (c) => {
  const homepageContent = await postRepository.getHomepagePosts();
  return c.json(homepageContent);
};


export { findAll, findOne, create, deleteOne, upvote, downvote, getHomepagePosts };