import type { Context } from "@hono/hono";
import * as communityRepository from "../repositories/communityRepository.ts";

const findAll = async (c: Context) => {
  const communities = await communityRepository.findAll();
  return c.json(communities);
}

const findOne = async (c: Context) => {
  const communityId = c.req.param("communityId");
  const community = await communityRepository.findOne(communityId);
  return c.json(community);
}

const create = async (c: Context) => {
  const user = c.get("user");
  const community = await c.req.json();
  const newCommunity = await communityRepository.create(community, user.id);
  return c.json(newCommunity);
}

const deleteOne = async (c: Context) => {
  const user = c.get("user");
  const communityId = c.req.param("communityId");
  const deletedCommunity = await communityRepository.deleteOne(communityId, user.id);
  return c.json(deletedCommunity);
}

export { findAll, findOne, create, deleteOne };