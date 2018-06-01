import { Request, Response, Router } from 'express';

import * as chatService from '../lib/chatservice';

const router: Router = Router();

router.get('/', (request: Request, response: Response) => {
    response.send('Hello, this is the node-chat-backend RESTFUL-API!');
});
router.get('/chats', (request: Request, response: Response) => chatService.getChatRooms());
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

export const ChatRestController: Router = router;