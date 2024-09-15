// src/app.js
import express from "express";
import http from "http";
import { handleWebSocketConnection } from "./controllers/websocket_controller.js";
import os from "os";
import dns from "dns";

const app = express();
const server = http.createServer(app);
handleWebSocketConnection(server);

server.listen(3000, () => {
  const hostname = os.hostname();
  dns.lookup(hostname, (err, addresses) => {
    if (err) {
      console.error("Error resolving hostname:", err);
    } else {
      console.log("Server IP:", addresses);
    }
  });
  console.log("Server listening on port 3000");
});
