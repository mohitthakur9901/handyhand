import { ExtendedWebSocket, SocketServer } from "../types";
import { publishLocation } from "../utils/publishLocation";

export const initLocationHandler = (wss: SocketServer) => {
  wss.on("connection", (ws: ExtendedWebSocket) => {
    ws.on("message", async (raw) => {
      try {
        const data = JSON.parse(raw.toString());

        if (data.type === "LOCATION") {
          if (!ws.userId) {
            console.warn("⚠️ Received location update but ws.userId missing");
            return;
          }

          // Publish to Redis + save last known location
          await publishLocation({
            userId: ws.userId,
            latitude: data.latitude,
            longitude: data.longitude,
          });

          console.log(
            `📍 Updated location for ${ws.userId}: ${data.latitude}, ${data.longitude}`
          );
        }
      } catch (err) {
        console.error("initLocationHandler parse error:", raw.toString(), err);
      }
    });
  });
};
