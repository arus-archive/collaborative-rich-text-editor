import * as http from "http";
import * as url from "url";

import CONFIG from "./config";

import apiRouter from "./api";
import cursorsServer from "./cursors";
import expressServer from "./expressServer";
import logger from "./logger";
import sharedbServer from "./sharedb";
import staticMiddleware from "./static";

const server = http.createServer(expressServer);

expressServer.use(staticMiddleware(CONFIG.STATIC_PATH));

expressServer.use("/api", apiRouter);

server.on("upgrade", (request, socket, head) => {
  const pathname = url.parse(request.url).pathname;

  if (pathname === "/sharedb") {
    sharedbServer.handleUpgrade(request, socket, head, (ws) => {
      sharedbServer.emit("connection", ws);
    });
  } else if (pathname === "/cursors") {
    cursorsServer.handleUpgrade(request, socket, head, (ws) => {
      cursorsServer.emit("connection", ws);
    });
  } else {
    socket.destroy();
  }
});

server.on("error", onServerError);
server.on("listening", onServerListening);

const port = CONFIG.PORT;
server.listen(port);

function onServerError(error: NodeJS.ErrnoException) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string"
    ? "Pipe " + port
    : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      logger.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onServerListening() {
  const addr = server.address();
  const bind = typeof addr === "string"
    ? "pipe " + addr
    : "port " + addr.port;
  logger.info("Listening on " + bind);
}
