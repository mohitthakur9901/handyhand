import { WebSocketServer } from "ws";
import { ExtendedWebSocket, SocketServer } from "../types";
import type { Server } from "http";
import { initNotificationHandler } from "../handlers/notification";

export const initWebSocketServer = (server: Server): SocketServer => {
  const wss = new WebSocketServer({ server });

  // ✅ Init global handlers ONCE
  initNotificationHandler(wss);

  wss.on("connection", (ws: ExtendedWebSocket) => {
    console.log("🔌 Client connected");

    ws.on("message", (raw) => {
      try {
        const data = JSON.parse(raw.toString());

        switch (data.type) {
          case "AUTH":
            ws.userId = data.userId;
            console.log(`✅ Authenticated socket: ${ws.userId}`);
            break;

          case "LOCATION_UPDATE":
            // ws.location = data.location;
            console.log(`📍 Updated location for ${ws.userId}:`, data.location);
            break;

          default:
            console.warn("⚠️ Unknown WS message:", data);
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
