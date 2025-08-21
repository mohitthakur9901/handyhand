import { WebSocket, WebSocketServer } from "ws";

export type ExtendedWebSocket = WebSocket & {
  userId?: string;
};

export type SocketServer = WebSocketServer & {
  clients: Set<ExtendedWebSocket>;
};
