import express from 'express';
import http from 'http';
import WebSocket from 'ws';

import * as command from '../interfaces/command.interface';
import * as message from '../interfaces/message.interface';
import { sessionInfo } from '../interfaces/sessionInfo.interface';
import * as chatService from '../lib/chatservice';

export function manageConnection(
  expressApp: express.Application,
  webSocket: WebSocket,
  httpRequest: http.IncomingMessage
) {
  webSocket.on("connection", message => {
    //send immediately a feedback to the incoming connection
    console.warn(`[WEBSOCKET]: connection opened: ${message}`);
    webSocket.send(
      JSON.stringify({
        opened:
          "Hi there, you connected to the node-chat-backend WebSocket Server"
      })
    );
  });

  webSocket.on("close", message => {
    console.warn(`[WEBSOCKET]: connection closed: ${message}`);
    webSocket.send(
      JSON.stringify({ closed: "node-chat-backend WebSocket closed. Bye!" })
    );
  });

  webSocket.on("error", error => {
    webSocket.send(JSON.stringify({ error: error.message }));
  });

  webSocket.on("ping", data => {
    webSocket.send(`pong: ${data}`);
  });

  webSocket.on("message", async (message: string) => {
    try {
      //log the received message
      console.log("received: %s", message);

      //parse message into JSON object
      var command: command.command = JSON.parse(message);

      //if the message didn't contain an action, send response
      if (!command.action) {
        return webSocket.send(
          JSON.stringify({ error: "Socket Action must be specified" })
        );
      }
      let handled = await handleSocketAction(
        expressApp,
        webSocket,
        httpRequest,
        command
      );
      webSocket.send(JSON.stringify(handled));
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
      if (command.message) {
        return chatService.postMessage(command.message);
      } else {
        return Promise.reject(new Error("message must be defined"));
      }
    case "getMessagesInRoom":
      if (command.roomName) {
        return chatService.getMessagesInRoom(command.roomName);
      } else {
        return Promise.reject(new Error("roomName must be defined"));
      }
    case "getUsersInRoom":
      if (command.roomName) {
        return chatService.getUsersInRoom(command.roomName);
      } else {
        return Promise.reject(new Error("roomName must be defined"));
      }
    case "getChatRooms":
      return chatService.getChatRooms();
    case "createChatRoom":
      if (command.roomName && command.user) {
        return chatService.createChatRoom(command.roomName, command.user);
      } else {
        return Promise.reject(new Error("roomName and user must be defined"));
      }
    case "joinChatRoom":
      if (command.roomName && command.user) {
        return chatService.joinChatRoom(command.roomName, command.user);
      } else {
        return Promise.reject(new Error("roomName and users must be defined"));
      }
    default:
      webSocket.send(JSON.stringify({ error: "unspecified action" }));
  }

  return Promise.resolve("Done");
}
