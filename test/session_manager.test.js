import {
  saveSession,
  getSession,
  removeSession,
} from "../src/services/session_manager.js";

describe("Session Manager Tests", () => {
  const clientId = "test-client";
  const sessionData = { userId: "123", token: "abc" };

  test("should save and retrieve session from Redis", async () => {
    await saveSession(clientId, sessionData);
    const retrievedSession = await getSession(clientId);
    expect(retrievedSession).toEqual(sessionData);
  });

  test("should remove session from Redis", async () => {
    await removeSession(clientId);
    const result = await getSession(clientId);
    expect(result).toBeNull();
  });
});
