import http from "http";


import app from "./app";
import { initWebSocketServer } from "./sockets/handler";

const httpServer = http.createServer(app);
initWebSocketServer(httpServer);

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
