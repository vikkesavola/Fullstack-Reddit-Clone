import * as communityRepository from "../repositories/communityRepository.js";

const findAll = async (c) => {
  const communities = await communityRepository.findAll();
  return c.json(communities);
}

const findOne = async (c) => {
  const communityId = await c.req.param("communityId");
  const community = await communityRepository.findOne(communityId);
  return c.json(community);
}

const create = async (c) => {
  const user = c.get("user");
  const community = await c.req.json();
  const newCommunity = await communityRepository.create(community, user.id);
  return c.json(newCommunity);
}

const deleteOne = async (c) => {
  const user = c.get("user");
  const communityId = await c.req.param("communityId");
  const deletedCommunity = await communityRepository.deleteOne(communityId, user.id);
  return c.json(deletedCommunity);
}

export { findAll, findOne, create, deleteOne };