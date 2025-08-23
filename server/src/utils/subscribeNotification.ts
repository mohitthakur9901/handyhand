import client from "../libs/redisClient";
import { ExtendedWebSocket, SocketServer } from "../types";

export const subscribeNotification = (wss: SocketServer) => {
  client.subscribe("notifications", (raw) => {
    try {
      const notif = JSON.parse(raw);

      // send only to the right user
      wss.clients.forEach((ws: ExtendedWebSocket) => {
        if (ws.userId === notif.userId && ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({ type: "NOTIFICATION", ...notif }));
          console.log(`📤 Sent notification to ${ws.userId}`);
        }
      });
    } catch (err) {
      console.error("Notification parse error:", raw);
    }
  });

  console.log("✅ Subscribed to Redis notifications channel");
};
