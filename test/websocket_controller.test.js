import WebSocket from "ws";
import { handleWebSocketConnection } from "../src/controllers/websocket_controller.js";
import { createServer } from "http";

let server, wss;

beforeAll((done) => {
  server = createServer();
  handleWebSocketConnection(server);
  server.listen(3001, done);
});

afterAll((done) => {
  server.close(done);
});

describe("WebSocket Controller Tests", () => {
  test("should connect and send a message", (done) => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.on("open", () => {
      ws.send(JSON.stringify({ priority: 1, content: "test message" }));
    });

    ws.on("message", (message) => {
      const parsedMessage = JSON.parse(message);
      expect(parsedMessage).toHaveProperty("priority");
      expect(parsedMessage).toHaveProperty("content", "test message");
      ws.close();
      done();
    });
  });

  test("should rate limit connections correctly", (done) => {
    const connections = [];

    for (let i = 0; i < 5; i++) {
      connections.push(new WebSocket("ws://localhost:3001"));
      connections[i].on("open", (event) => {
        connections[i].send(
          JSON.stringify({ priority: 1, content: "test message" })
        );
        connections[i].close();
      });
    }

    const ws6 = new WebSocket("ws://localhost:3001");

    ws6.on("close", (code) => {
      if (code === 1008) {
        done();
      }
    });
  });
});
