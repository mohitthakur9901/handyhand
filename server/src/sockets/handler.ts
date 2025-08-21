import { WebSocketServer } from "ws";
import { ExtendedWebSocket, SocketServer } from "../types";
import type { Server } from "http";
import client from "../libs/redisClient";

export const initWebSocketServer = (server: Server): SocketServer => {
  const wss = new WebSocketServer({ server });

  client.subscribe("notifications", (raw) => {
    try {
      const notif = JSON.parse(raw);

      // Send only to connected user
      wss.clients.forEach((ws: ExtendedWebSocket) => {
        if (ws.userId === notif.userId && ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify(notif));
          console.log(`📤 Sent WS notification to user ${notif.userId}`);
        }
      });
    } catch (err) {
      console.error("Redis message parse error:", raw);
    }
  });

  // Handle client connection
  wss.on("connection", (ws: ExtendedWebSocket) => {
    console.log("🔌 Client connected");

    ws.on("message", (raw) => {
      try {
        const data = JSON.parse(raw.toString());

        if (data.type === "AUTH") {
          ws.userId = data.userId; // save userId in socket
          console.log(`✅ Authenticated socket for ${ws.userId}`);
        }
      } catch (err) {
        console.error("Invalid WS message:", raw.toString());
      }
    });

    ws.on("close", () => {
      console.log(`❌ Client disconnected: ${ws.userId ?? "unknown"}`);
    });
  });

  return wss;
};
