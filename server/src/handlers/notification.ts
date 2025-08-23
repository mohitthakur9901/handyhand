import { ExtendedWebSocket, SocketServer } from "../types";
import { subscribeNotification } from "../utils/subscribeNotification";

export const initNotificationHandler = (wss: SocketServer) => {
  subscribeNotification(wss);
};
