import * as WebSocket from "ws";

export default interface IExtWebSocket extends WebSocket {
  id: string;
  isAlive: boolean;
}
