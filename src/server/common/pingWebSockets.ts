import * as WebSocket from "ws";
import IExtWebSocket from "./IExtWebSocket";

const pingWebSockets = (webSocket: WebSocket.Server) => {
  webSocket.clients.forEach( (ws) => {
    const extWS = ws as IExtWebSocket;
    if (extWS.isAlive === false) {
      return ws.terminate();
    }
    extWS.isAlive = false;
    extWS.ping();
  });
};

export default pingWebSockets;
