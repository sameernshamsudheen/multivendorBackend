// websocket.js
import { WebSocketServer } from "ws";
import "dotenv/config";

// Create WebSocket server
export const wss = new WebSocketServer({ port: process.env.WEBSOCKET_PORT });

// Broadcast function
export const sendWebSocketNotification = (userId, message) => {
  const notification = JSON.stringify({ userId, message });

  // Send message to all connected clients (or filter based on user ID if needed)
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(notification);
    }
  });
};
