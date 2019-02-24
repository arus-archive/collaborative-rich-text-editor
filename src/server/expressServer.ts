import * as express from "express";

const expressServer = express();
expressServer.use(express.json());

export default expressServer;
