import { Request, Response, Router } from 'express';

import * as chatService from '../lib/chatservice';

const router: Router = Router();

router.get("/", (request: Request, response: Response) => {
  response.send("Hello, this is the node-chat-backend RESTFUL-API!");
});
router.get("/chats", async (request: Request, response: Response) => {
  response.send(await chatService.getChatRooms());
});
router.get(
  "/chats/:room/messages",
  async (request: Request, response: Response) => {
    response.send(await chatService.getMessagesInRoom(request.params.room));
  }
);
router.post("/chats/:room", (request: Request, response: Response) => {
  //chatService.postMessage();
});
router.get("/chats/:room/users", async (request: Request, response: Response) => {
  response.send(await chatService.getUsersInRoom(request.params.room));
});
// router.post("/chats/users/:user", (request: Request, response: Response) => {
//   chatService.postPrivateMessage();
// });

export const ChatRestController: Router = router;
