import {find, findIndex} from "lodash";
import * as uuid from "uuid";
import * as WebSocket from "ws";

import ICursorWebSocket from "../common/ICursorWebSocket";
import pingWebSockets from "../common/pingWebSockets";
import logger from "../logger";

/**
 * Return hex code of random color
 */
export function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function notifyConnections(sourceId: string, documentId: string | null) {
  const documentConnections = connections
    .filter((value) => !documentId || value.document.id === documentId);

  documentConnections
    .forEach((connection: ICursorWebSocket) => {
      const session = sessions.get(connection.id);
      if (session) {
        const message = {
          connections: documentConnections,
          id: connection.id,
          sourceId,
        };
        session.send(JSON.stringify(message));
      }
    });
}

const sessions = new Map<string, ICursorWebSocket>();
const connections: ICursorWebSocket[] = [];

const wss = new WebSocket.Server({
  noServer: true,
});

wss.on("connection", (ws: ICursorWebSocket, req) => {
  ws.id = uuid();
  ws.isAlive = true;

  logger.info(`[Cursors] A new client (${ws.id}) connected`);

  ws.on("message", (data) => {
    const message = JSON.parse(data.toString());
    logger.info(`[Cursors] Message received: (${data})`);

    const connectionIdNotSet = !message.id;
    if (connectionIdNotSet) {
      const emptyConnectionArray = {
        connections: [],
        id: ws.id,
        sourceId: ws.id,
      };
      ws.send(JSON.stringify(emptyConnectionArray));
      return;
    }

    if (!message.color) {
      const sameUserConnection = find(connections, (connection) =>
        connection.user.login === message.user.login,
      );
      message.color = sameUserConnection
        ? sameUserConnection.color
        : getRandomColor();
    }

    const isConnectionRegistered = sessions.get(ws.id);
    if (isConnectionRegistered) {
      const connectionIndex = findIndex(connections, {id: message.id});
      const connectionNotFound = connectionIndex === -1;
      if (connectionNotFound) {
        return;
      }
      // Update connection data
      connections[connectionIndex] = message;
    } else {
      // Override/refresh connection id
      message.id = ws.id;

      // Push/add connection to connections hashtable
      connections.push(message);

      // Push/add session to sessions hashtable
      sessions.set(message.id, ws);
    }
    logger.info("[Cursors] Connection update received:", message);
    notifyConnections(message.id, message.document.id);
  });

  ws.on("close", (code, reason) => {
    logger.info(`[Cursors] Client connection closed (${ws.id}). (Code: ${code}, Reason: ${reason})`);

    const connectionIndex = findIndex(connections, (connection) => connection.id === ws.id);
    let documentId = null;
    const connectionFound = connectionIndex !== -1;
    if (connectionFound) {
      const connectionToClose = connections[connectionIndex];
      documentId = connectionToClose.document.id;
      logger.info("[Cursors] Connection removed: ", connectionToClose);
      connections.splice(connectionIndex, 1);
    }
    sessions.delete(ws.id);
    notifyConnections(ws.id, documentId);
  });

  ws.on("error", (error) => {
    logger.info(`[Cursors] Client connection errored (${ws.id}). (Error: ${error})`);
    const connectionIndex = findIndex(connections, (connection) => connection.id === ws.id);
    const connectionFound = connectionIndex !== -1;
    if (connectionFound) {
      logger.info("[Cursors] Errored connection: ", connections[connectionIndex]);
    }
  });

  ws.on("pong", () => {
    ws.isAlive = true;
  });
});

setInterval(() => pingWebSockets(wss), 30000);

export default wss;
