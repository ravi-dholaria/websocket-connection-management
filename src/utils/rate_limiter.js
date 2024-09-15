// src/utils/rate_limiter.js
import { RateLimiterMemory } from "rate-limiter-flexible";

const messageLimiter = new RateLimiterMemory({
  points: 30, // 5 messages
  duration: 30, // per second
});

const connectionLimiter = new RateLimiterMemory({
  points: 5, // 100 connections
  duration: 600, // per minute
});

export const checkMessageRate = async (clientId) => {
  try {
    await messageLimiter.consume(clientId);
    return true;
  } catch (rejRes) {
    return false; // rate limited
  }
};

export const checkConnectionRate = async (clientId) => {
  try {
    await connectionLimiter.consume(clientId);
    return true;
  } catch (rejRes) {
    return false; // connection limit reached
  }
};
