"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const controllers_1 = require("./controllers");
const webSocketController = __importStar(require("./controllers/websocket.controller"));
const expressApp = express_1.default();
const port = 3000;
const server = http_1.default.createServer(expressApp);
const webSocketServer = new ws_1.default.Server({ server });
webSocketServer.on("connection", (webSocket, httpRequest) => webSocketController.manageConnection(expressApp, webSocket, httpRequest));
//websocket error handling
webSocketServer.on("error", () => { });
expressApp.use("/welcome", controllers_1.WelcomeController);
expressApp.use("/api", controllers_1.ChatRestController);
expressApp.use("/", controllers_1.rootController);
server.listen(port, () => {
    // Success callback
    console.log(`Listening at http://localhost:${port}/`);
});
//# sourceMappingURL=server.js.map