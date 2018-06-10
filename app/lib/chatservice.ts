import WebSocket from 'ws';

import { CouchDb } from '@teammaestro/node-couchdb-client';

import { message } from '../interfaces/message.interface';
import { room } from '../interfaces/room.interface';
import { user } from '../interfaces/user.interface';
import { environment } from './environment';

// Instatiate new CouchDB request class
const db = new CouchDb(environment.CouchCredentials);

export async function getChatRooms() {
  console.info(`[CHATSERVICE]: executing getChatRooms`);
  var rooms = await db.getDocuments({
    dbName: "rooms",
    options: { include_docs: true }
  });
  let result: room[] = [];
  rooms.rows.forEach(element => {
    if (element.doc) {
      var room: room = {} as room;
      room.roomName = element.doc.roomName;
      room.created = element.doc.created;
      room.users = element.doc.users;
      room.owners = element.doc.owners;
      if (element.doc.messages) {
        room.messages = element.doc.messages;
      }
      if (element.doc.password) {
        room.password = element.doc.password;
      }
      result.push(room);
    }
  });
  return { action: "getChatRooms", rooms: result };
}

export async function getMessagesInRoom(roomName: string) {
  console.info(`[CHATSERVICE]: executing getMessagesInRoom for: ${roomName}`);
  const existingRooms = await db.findDocuments({
    dbName: "rooms",
    findOptions: { selector: { roomName: roomName } }
  });

  let rooms: string[] = [];
  existingRooms.docs.forEach(document => rooms.push(document.roomName));

  if (rooms.indexOf(roomName) > -1) {
    var messages = await db.findDocuments({
      dbName: "messages",
      findOptions: { selector: { roomName: roomName } }
    });

    let result: message[] = [];
    messages.docs.forEach(document => {
      if (document) {
        var message: message = {} as message;
        message.user = document.user;
        message.roomName = document.roomName;
        message.text = document.text;
        message.timestamp = document.timestamp;
        if (document.meta) {
          message.meta = document.meta;
        }
        result.push(message);
      }
    });
    return {
      action: "getMessagesInRoom",
      roomName: roomName,
      messages: result
    };
  } else {
    return { error: `There is no Room ${roomName}. Create it first!` };
  }
}

export async function createChatRoom(roomName: string, creator: user) {
  console.info(`[CHATSERVICE]: executing createChatRoom ${roomName} for user ${creator}`);
  const room: room = {
    roomName: roomName,
    created: new Date(Date.now()),
    owners: [creator],
    users: [creator]
  };
  const existingRooms = await db.findDocuments({
    dbName: "rooms",
    findOptions: { selector: { roomName: roomName } }
  });

  if (existingRooms.docs.length > 0) {
    return Promise.reject(new Error(`Room ${roomName} already exists`));
  }
  return db.createDocument({ doc: room, dbName: "rooms" });
}

export async function joinChatRoom(roomName: string, joining: user) {
  console.info(`[CHATSERVICE]: executing joinChatRoom ${roomName} for user ${joining}`);
  const existingRooms = await db.findDocuments({
    dbName: "rooms",
    findOptions: { selector: { roomName: roomName } }
  });

  if (existingRooms.docs.length > 0) {
    if (existingRooms.docs.length < 2) {
      let joinedUsers: string[] = [];
      existingRooms.docs[0].users.forEach((user: user) => {
        joinedUsers.push(user.userName);
      });
      if (joinedUsers.indexOf(joining.userName) > -1) {
        return Promise.reject(
          new Error(`User ${joining.userName} already in Room ${roomName}`)
        );
      } else {
        let newUsers: user[] = existingRooms.docs[0].users;
        newUsers.push(joining);
        return db.updateDocument({
          dbName: "rooms",
          docId: existingRooms.docs[0]._id,
          rev: existingRooms.docs[0]._rev || "",
          updatedDoc: {
            _id: existingRooms.docs[0]._id,
            _rev: existingRooms.docs[0]._rev,
            roomName: existingRooms.docs[0].roomName,
            created: existingRooms.docs[0].created,
            owners: existingRooms.docs[0].owners,
            users: newUsers
          }
        });
      }
    } else {
      return Promise.reject(new Error(`Room ${roomName} has duplictes!`));
      //TODO: delete duplicates
    }
  } else {
    return Promise.reject(
      new Error(`Room ${roomName} doesn't exist, create it first`)
    );
  }
}

export async function postMessage(message: message) {
  console.info(`[CHATSERVICE]: executing postMessage`);
  const existingRooms = await db.findDocuments({
    dbName: "rooms",
    findOptions: { selector: { roomName: message.roomName } }
  });

  let rooms: string[] = [];
  let users: string[] = [];

  existingRooms.docs.forEach(document => {
    rooms.push(document.roomName);
    document.users.forEach((user: user) => users.push(user.userName));
  });

  if (rooms.indexOf(message.roomName) > -1) {
    if (users.indexOf(message.user.userName) > -1) {
      const sent = await db.createDocument({
        doc: message,
        dbName: "messages"
      });
      if (sent.hasOwnProperty("ok")) {
        return { action: "postMessage", message: message };
      } else {
        return Promise.reject(
          new Error(
            `Message could not be sent to Server, Database Error: ${sent}`
          )
        );
      }
    } else {
      return Promise.reject(
        new Error(
          `User ${message.user.userName} hasn't joined the room, join it first!`
        )
      );
    }
  } else {
    return Promise.reject(
      new Error(
        `Room ${message.roomName} doesn't exist, create and join it first`
      )
    );
  }
}

export async function getUsersInRoom(roomName: string) {
  console.info(`[CHATSERVICE]: executing getUsersInRoom for ${roomName}`);
  const existingRooms = await db.findDocuments({
    dbName: "rooms",
    findOptions: { selector: { roomName: roomName } }
  });

  let rooms: string[] = [];
  existingRooms.docs.forEach(document => rooms.push(document.roomName));

  if (rooms.indexOf(roomName) > -1) {
    let result: user[] = existingRooms.docs[0].users;
    return {
      action: "getUsersInRoom",
      roomName: roomName,
      users: result
    };
  } else {
    return { error: `There is no Room ${roomName}. Create it first!` };
  }
}

export async function broadcastPostedMessage(
  message: message,
  webSocketServer: WebSocket.Server
) {
  console.info(`[CHATSERVICE]: executing broadcastPostedMessage`);
  const existingRooms = await db.findDocuments({
    dbName: "rooms",
    findOptions: { selector: { roomName: message.roomName } }
  });

  let rooms: string[] = [];
  let users: string[] = [];

  existingRooms.docs.forEach(document => {
    rooms.push(document.roomName);
    document.users.forEach((user: user) => users.push(user.userName));
  });
  webSocketServer.clients.forEach(client => {
    //somehow check, if client has joined channel
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ action: "postMessage", message: message }));
    }
  });
}

module.exports = {
  getChatRooms,
  createChatRoom,
  joinChatRoom,
  getMessagesInRoom,
  postMessage,
  getUsersInRoom,
  broadcastPostedMessage
};
