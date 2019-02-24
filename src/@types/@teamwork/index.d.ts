/// <reference types="node" />

declare module "@teamwork/websocket-json-stream" {
    export = WebsocketJsonStream;

    import * as WebSocket from "ws";
    class WebsocketJsonStream {
        constructor(ws: WebSocket)
    }

}
