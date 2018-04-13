"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const controllers_1 = require("./controllers");
const app = express_1.default();
const port = 3000;
const server = http_1.default.createServer(app);
const wss = new ws_1.default.Server({ server });
wss.on('connection', (ws) => {
    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {
        //log the received message and send it back to the client
        console.log('received: %s', message);
        ws.send(`Hello, you sent -> ${message}`);
    });
    //send immediatly a feedback to the incoming connection
    ws.send('Hi there, I am a WebSocket server');
});
app.use('/welcome', controllers_1.WelcomeController);
server.listen(port, () => {
    // Success callback
    console.log(`Listening at http://localhost:${port}/`);
});
//# sourceMappingURL=server.js.map