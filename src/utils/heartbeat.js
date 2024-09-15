// src/utils/heartbeat.js
let heartbeatInterval = 30000; // Default 30s
let connectedClients = 0;

export const setHeartbeatInterval = (serverLoad) => {
  heartbeatInterval = 30000 - serverLoad * 100; // Reduce interval as load increases
};

export const startHeartbeat = (ws) => {
  setInterval(() => {
    // console.log(`state: ${ws.readyState}`);
    if (ws.readyState == ws.OPEN || ws.readyState == 1) {
      ws.send(JSON.stringify({ type: "heartbeat" }));
    }
  }, heartbeatInterval);
};

export const updateClientCount = (count) => {
  connectedClients = count;
  setHeartbeatInterval(connectedClients);
};
