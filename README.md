## node-chat-backend for DHBW Course

Chat API-Server, default Port: 3000

### TypeScript Interfaces:

``` TypeScript
export interface command {
  action: string; //always needed
  user: user; //used for creating/joining a room and updating the websocket session
  roomName?: string; //used for joining/creating a room as well as getting rooms/messages/users
  message?: message; //used for posting messages
}
```

``` TypeScript
export interface message {
  user: user;
  roomName: string;
  text: string;
  timestamp: Date;
  meta?: any;
}
```

``` TypeScript
export interface room {
    roomName: string,
    created: Date,
    owners: user[], //creator and admins of room
    users: user[], //
    messages?: message[],
    password?: string
}
```

``` TypeScript
export interface user {
    userName: string
}
```

### REST API:

* [GET] /api/chats
  * returns a list of all chat-rooms (names) WORKS
* [GET] /api/chats/:room
  * returns a list of messages for :room WORKS
* [POST] /api/chats/:room
  * posts a message in :room and returns all messages of that room COMING
* [GET] /api/chats/:room/users
  * returns a list of users who have posted in :room WORKS
* [POST] /api/chats/users/:user DEFINITELY NOT COMING
  * post a private message to :user and return all messages with that :user, sorted by time

### Websocket API:

WORKING

Connect to Websocket Endpoint ws://bigbluewhale:3000/

Websocket are in JSON format. Declare a property named 'action' to invoke functionalities:

* Posting Message in Room:

```TypeScript
{
  action: "postMessage",
  message: {
    user: user,
    roomName: "Lobby",
    text: "Hello world!",
    timestamp: "2018-01-01T00:00:00.000Z",
    meta: {}
  }
}
```

returns the message posted and broadcasts the message to users via websocket in this format:

```TypeScript
{
  action: "postMessage",
  message: {
    "user": {
      "userName": "TestUser"
    },
    roomName: "Lobby",
    text: "Hello world!",
    timestamp: "2018-01-01T00:00:00.000Z",
    meta: {}
  }
}
```

or an error of the format

```TypeScript
{ error: reason }
```

* List all chat rooms:

```TypeScript
{
  action: "getChatRooms",
}
```

* returns an object of this format:

```TypeScript
{
  action: "getChatRooms"
  chatRooms: room[]
}
```

* List all Users in Room:

```TypeScript
{
  action: "getUsersInRoom",
  roomName: "roomName"
}
```

* in this format

```TypeScript
{
  action: "getUsersInRoom",
  roomName: "roomName",
  users: user[]
}
```

* List all Messages in Room:

```TypeScript
{
  action: "getMessagesInRoom",
  roomName: "roomName"
}
```

* in this format

```TypeScript
{
  action: "getMessagesInRoom",
  roomName: "roomName"
  messages: message[]
}
```

* Join a room

```TypeScript
{
  action: "joinChatRoom",
  roomName: "Lobby",
  user: user
}
```

* Create a new room

```TypeScript
{
  action: "createChatRoom",
  roomName: "My own Lobby - with black jack and hookers!",
  user: user
}
```

### Authentication

COMING
