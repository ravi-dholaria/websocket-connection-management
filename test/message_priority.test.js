import {
  prioritizeMessage,
  sendMessage,
} from "../src/services/message_priority.js";

describe("Message Priority Tests", () => {
  let ws;

  beforeAll(() => {
    ws = { send: jest.fn() }; // Mock WebSocket send function
  });

  test("should prioritize messages", () => {
    prioritizeMessage({ priority: 1, content: "Low priority" });
    prioritizeMessage({ priority: 3, content: "High priority" });
    prioritizeMessage({ priority: 2, content: "Medium priority" });

    sendMessage(ws);
    expect(ws.send).toHaveBeenCalledWith(
      JSON.stringify({ priority: 3, content: "High priority" })
    );

    sendMessage(ws);
    expect(ws.send).toHaveBeenCalledWith(
      JSON.stringify({ priority: 2, content: "Medium priority" })
    );

    sendMessage(ws);
    expect(ws.send).toHaveBeenCalledWith(
      JSON.stringify({ priority: 1, content: "Low priority" })
    );
  });
});
