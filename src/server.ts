import app from "./app";
import http from "http";
import env from "./config/env";
import logger from "./utils/logger";

const PORT = env.application.port;
const server = http.createServer(app);
const HOST = "0.0.0.0";

const startServer = async () => {
  try {
    server.listen(PORT, () => {
      logger.info(
        `🚀 Research Assistant API running on http://localhost:${PORT}`,
      );
      logger.info(`📡 Environment: ${env.application.env}`);
    });
  } catch (err) {
    logger.error(`💀 Fatal: Failed to start server due to error ${err}`);
    process.exit(1);
  }
};

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.syscall !== "listen") throw error;

  const bind = typeof PORT === "string" ? `Pipe ${PORT}` : `Port ${PORT}`;
  switch (error.code) {
    case "EACCES":
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
    case "EADDRINUSE":
      logger.error(`${bind} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
});

process.on("SIGTERM", () => {
  server.close(() => {
    logger.info("🔌 Server closed");
    process.exit(0);
  });
});

startServer();
