// src/services/session_manager.js
import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

export const saveSession = async (clientId, sessionData) => {
  await redis.set(clientId, JSON.stringify(sessionData), "EX", 3600);
};

export const getSession = async (clientId) => {
  const session = await redis.get(clientId);
  return session ? JSON.parse(session) : null;
};

export const removeSession = async (clientId) => {
  await redis.del(clientId);
};
