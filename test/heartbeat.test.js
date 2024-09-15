import {
  startHeartbeat,
  setHeartbeatInterval,
  updateClientCount,
} from "../src/utils/heartbeat.js";

jest.useFakeTimers();

describe("Heartbeat Tests", () => {
  let ws;

  beforeAll(() => {
    ws = { send: jest.fn(), readyState: 1 }; // Mock WebSocket send function and readyState OPEN
  });

  test("should send heartbeat at default interval", () => {
    startHeartbeat(ws);
    jest.advanceTimersByTime(30000);
    expect(ws.send).toHaveBeenCalledWith(
      expect.stringMatching(/{"type":"heartbeat"}/)
    );
  });

  test("should adjust heartbeat interval based on client load", () => {
    updateClientCount(100); // Simulate heavy load
    setHeartbeatInterval(15000); // Shorten the interval
    startHeartbeat(ws);

    jest.advanceTimersByTime(15000);
    expect(ws.send).toHaveBeenCalledWith(JSON.stringify({ type: "heartbeat" }));
  });
});
