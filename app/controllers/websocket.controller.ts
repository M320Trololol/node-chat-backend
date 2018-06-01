import express from 'express';
import http from 'http';
import WebSocket from 'ws';

import * as command from '../interfaces/command.interface';
import * as message from '../interfaces/message.interface';
import * as chatService from '../lib/chatservice';

interface sessionInfo {
  chatUser?: string;
  roomId?: string;
  chatRooms?: [string];
  //additional properties
}

export function manageConnection(
  expressApp: express.Application,
  webSocket: WebSocket,
  httpRequest: http.IncomingMessage
) {
  webSocket.on("connection", () => {
    //send immediately a feedback to the incoming connection
    webSocket.send(
      "Hi there, you connected to the node-chat-backend WebSocket Server"
    );
  });

  webSocket.on("close", message => {
    console.warn(`[WEBSOCKET]: connection close: ${message}`);
    webSocket.send(
      JSON.stringify({ close: "node-chat-backend WebSocket closed. Bye!" })
    );
  });

  webSocket.on("error", error => {
    webSocket.send(JSON.stringify({ error: error.message }));
  });

  webSocket.on("ping", data => {
    webSocket.send(`pong: ${data}`);
  });

  webSocket.on("message", (message: string) => {
    try {
      var websocketSession: sessionInfo = {};

      //log the received message
      console.log("received: %s", message);

      //parse message into JSON object
      var command: command.command = JSON.parse(message);
      command.timestamp = new Date (Date.now());

      //log parsed object
      console.log("parsed to: %s", command);

      //set user
      websocketSession.chatUser = command.user;

      //check if incoming message contains a roomId
      if (command.roomId) {
        //if there aren't any chat rooms for the current session, initialize the array with an empty array
        if (!websocketSession.chatRooms) {
          websocketSession.chatRooms = [""];
        }
        //if there are chat rooms, check if the roomId from the message is one of them and if not, create that room
        if (websocketSession.chatRooms.indexOf(command.roomId) > -1) {
          websocketSession.chatRooms.push(command.roomId);
        }
      }

      //if the message didn't contain an action, send response
      if (!command.action) {
        return webSocket.send(
          JSON.stringify({ error: "Socket Action must be specified" })
        );
      }
      webSocket.send(JSON.stringify(handleSocketAction(expressApp, webSocket, httpRequest, command)))/*.catch(
        (error: Error) => {
          webSocket.send(JSON.stringify({ error: error.message }));
        }
      );*/
    } catch (error) {
      webSocket.send(JSON.stringify({ error: error.message }));
    }
  });
}

function handleSocketAction(
  expressApp: express.Application,
  webSocket: WebSocket,
  httpRequest: http.IncomingMessage,
  command: command.command
) {
  console.log(`Websocket Action received: ${command.action}`);
  switch (command.action) {
    case "postPrivateMessage":
      // return chatService.postPrivateMessage(command.user, { command.user, command.message, command.meta });
    case "postMessage":
      // return chatService.postMessage(command.roomId, { command.user, command.message, command.meta });
    case "getMessagesInRoom":
      return chatService.getMessagesInRoom(command.roomId);
    case "getUsersInRoom":
      // return chatService.getUsersInRoom(command.roomId);
    case "getChatRooms":
      return chatService.getChatRooms();
    default:
      webSocket.send(JSON.stringify({ error: "unspecified action" }));
  }

  return Promise.resolve("Done");
}
