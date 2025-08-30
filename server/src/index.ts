import http from "http";
import app from "./app";
import { initWebSocketServer } from "./sockets/handler";
import { infoLogger, errorLogger } from "./utils/Logger"; 

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

initWebSocketServer(httpServer);

httpServer.listen(PORT, () => {
  infoLogger.info(`🚀 Server is running on port ${PORT}`);
});

httpServer.on("error", (error: any) => {
  errorLogger.error(`❌ Server error: ${error.message}`);
});
