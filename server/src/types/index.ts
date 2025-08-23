import { WebSocket, WebSocketServer } from "ws";

export type ExtendedWebSocket = WebSocket & {
  userId?: string;
};

export type SocketServer = WebSocketServer & {
  clients: Set<ExtendedWebSocket>;
};

export interface Notification {
  userId: string;
  title: string;
  message: string;
  type: string;
}

export interface Location {
  userId: string;
  latitude: number;
  longitude: number;
  
}
