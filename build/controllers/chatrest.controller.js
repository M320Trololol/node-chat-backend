"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatService = __importStar(require("../lib/chatservice"));
const router = express_1.Router();
router.get('/', (request, response) => {
    response.send('Hello, this is the node-chat-backend RESTFUL-API!');
});
router.get('/chats', (request, response) => chatService.getChatRooms());
// router.get('/chats/:room', (request: Request, response: Response) => chatService.getMessagesInRoom());
// router.post('/chats/:room', (request: Request, response: Response) => chatService.postMessage());
// router.get('/chats/:room/users', (request: Request, response: Response) => chatService.getUsersInRoom());
// router.post('/chats/users/:user', (request: Request, response: Response) => chatService.postPrivateMessage());
// getChatRooms
// getMessagesInRoom
// postMessage
// getUsersInRoom
// postPrivateMessage
// getPrivateChatRoomName
exports.ChatRestController = router;
//# sourceMappingURL=chatrest.controller.js.map