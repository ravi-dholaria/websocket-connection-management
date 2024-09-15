// src/controllers/websocket_controller.js
import { WebSocketServer } from "ws";
import {
  checkMessageRate,
  checkConnectionRate,
} from "../utils/rate_limiter.js";
import { startHeartbeat, updateClientCount } from "../utils/heartbeat.js";
import {
  prioritizeMessage,
  sendMessage,
} from "../services/message_priority.js";
import {
  saveSession,
  getSession,
  removeSession,
} from "../services/session_manager.js";
import send from "send";

const clients = new Map();

export const handleWebSocketConnection = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", async (ws, req) => {
    const clientId = req.socket.remoteAddress;
    if (!(await checkConnectionRate(clientId))) {
      ws.close(1008, "Connection rate limit exceeded");
      return;
    }

    clients.set(clientId, ws);
    updateClientCount(clients.size);

    ws.on("message", async (message) => {
      if (!(await checkMessageRate(clientId))) {
        ws.send(JSON.stringify({ error: "Rate limit exceeded" }));
        return;
      }

      const parsedMessage = JSON.parse(message);
      //   console.log(parsedMessage);
      prioritizeMessage(parsedMessage);
      sendMessage(ws);
    });

    ws.on("close", () => {
      clients.delete(clientId);
      removeSession(clientId);
      updateClientCount(clients.size);
    });

    startHeartbeat(ws);
  });
};
