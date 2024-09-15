import {
  checkMessageRate,
  checkConnectionRate,
} from "../src/utils/rate_limiter.js";

describe("Rate Limiter Tests", () => {
  test("should allow limited number of messages", async () => {
    const clientId = "client1";
    for (let i = 0; i < 30; i++) {
      const result = await checkMessageRate(clientId);
      expect(result).toBe(true);
    }
    const result = await checkMessageRate(clientId);
    expect(result).toBe(false); // Exceeded rate limit
  });

  test("should limit connections per minute", async () => {
    const clientId = "client2";
    for (let i = 0; i < 5; i++) {
      const result = await checkConnectionRate(clientId);
      expect(result).toBe(true);
    }
    const result = await checkConnectionRate(clientId);
    expect(result).toBe(false); // Exceeded connection rate limit
  });
});
