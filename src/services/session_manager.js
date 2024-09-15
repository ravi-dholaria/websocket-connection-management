// src/services/session_manager.js
import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  retryStrategy(times) {
    return Math.min(times * 50, 2000); // Retry strategy for connection failures
  },
});

export const saveSession = async (clientId, sessionData) => {
  try {
    await redis.set(clientId, JSON.stringify(sessionData), "EX", 3600);
  } catch (error) {
    console.error("Error saving session:", error);
  }
};

export const getSession = async (clientId) => {
  try {
    const session = await redis.get(clientId);
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error("Error retrieving session:", error);
    return null;
  }
};

export const removeSession = async (clientId) => {
  try {
    await redis.del(clientId);
  } catch (error) {
    console.error("Error removing session:", error);
  }
};
