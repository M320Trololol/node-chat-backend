import express from 'express';
import http from 'http';
import WebSocket from 'ws';

import { ChatRestController, rootController, WelcomeController } from './controllers';
import * as webSocketController from './controllers/websocket.controller';

const expressApp: express.Application = express();

const port: number = 3000;

const server = http.createServer(expressApp);
const webSocketServer = new WebSocket.Server({ server });

webSocketServer.on("connection", (webSocket, httpRequest) =>
  webSocketController.manageConnection(expressApp, webSocket, httpRequest)
);

//websocket error handling
webSocketServer.on("error", () => {})

expressApp.use("/welcome", WelcomeController);
expressApp.use("/api", ChatRestController);
expressApp.use("/", rootController);

server.listen(port, () => {
  // Success callback
  console.log(`Listening at http://localhost:${port}/`);
});
