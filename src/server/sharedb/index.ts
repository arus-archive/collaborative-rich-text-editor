import WebSocketJSONStream = require("@teamwork/websocket-json-stream");
import * as WebSocket from "ws";

import * as RichText from "rich-text";
import * as ShareDB from "sharedb";
// import ShareDBMongo = require("sharedb-mongo");

import * as uuid from "uuid";

import IExtWebSocket from "../common/IExtWebSocket";
import pingWebSockets from "../common/pingWebSockets";
// import CONFIG from "../config";
import logger from "../logger";

ShareDB.types.register(RichText.type);

const shareDBServer = new ShareDB({
//  by default it uses ShareDB.MemoryDB to switch to MongoDB use:
//  db: new ShareDBMongo(CONFIG.MONGODB_URI),
});

const wss = new WebSocket.Server({
  noServer: true,
});

wss.on("connection", (ws: IExtWebSocket, req) => {
  ws.id = uuid();
  ws.isAlive = true;

  logger.info(`[ShareDB] A new client (${ws.id}) connected.`);

  const stream = new WebSocketJSONStream(ws);
  shareDBServer.listen(stream);

  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("error", (error) => {
    logger.info(`[ShareDB] Client connection errored (${ws.id})). (Error: ${error}))`);
  });
});

setInterval(() => pingWebSockets(wss), 30000);

export default wss;
