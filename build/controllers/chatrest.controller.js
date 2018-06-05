"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
router.get('/chats', (request, response) => __awaiter(this, void 0, void 0, function* () {
    response.send(yield chatService.getChatRooms());
}));
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