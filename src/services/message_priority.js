// src/services/message_priority.js
const messageQueue = [];

export const prioritizeMessage = (message) => {
  const { priority, content } = message;
  messageQueue.push({ priority, content });
  messageQueue.sort((a, b) => b.priority - a.priority); // High priority first
};

export const sendMessage = (ws) => {
  if (messageQueue.length > 0) {
    const messageToSend = messageQueue.shift(); // Send highest priority message
    ws.send(JSON.stringify(messageToSend));
  }
};
