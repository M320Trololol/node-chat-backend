import express from 'express';
import http from 'http';
import WebSocket from 'ws';

import { command } from '../interfaces/command.interface';
import { message } from '../interfaces/message.interface';
import * as chatService from '../lib/chatservice';

export function manageConnection(
  expressApp: express.Application,
  webSocket: WebSocket,
  httpRequest: http.IncomingMessage,
  webSocketServer: WebSocket.Server
) {
  webSocket.on("open", () => {
    console.warn(`[WEBSOCKET]: connection opened`);
  });

  webSocket.on("close", message => {
    console.warn(`[WEBSOCKET]: connection closed: ${message}`);
  });

  webSocket.on("error", error => {
    console.warn(`[WEBSOCKET]: error encountered: ${error}`);
    webSocket.send(JSON.stringify({ error: error.message }));
  });

  webSocket.on("message", async (message: string) => {
    try {
      //parse message into JSON object
      var command: command = JSON.parse(message);

      //if the message didn't contain an action, send response
      if (!command.action) {
        return webSocket.send(
          JSON.stringify({ error: "Socket Action must be specified" })
        );
      }

      //otherwise handle it
      let handled = await handleSocketAction(
        expressApp,
        webSocket,
        httpRequest,
        command,
        webSocketServer
      ).catch(error => {
        console.warn(`Socket Action could not be handles ${error}`);
      });

      //send result to the client
      webSocket.send(JSON.stringify(handled));
    } catch (error) {
      //catching JSON parse errors
      webSocket.send(JSON.stringify({ error: error.message }));
    }
  });
}

function handleSocketAction(
  expressApp: express.Application,
  webSocket: WebSocket,
  httpRequest: http.IncomingMessage,
  command: command,
  webSocketServer: WebSocket.Server
) {
  switch (command.action) {
    case "postMessage":
      if (command.message) {
        let posted = chatService.postMessage(command.message);
        //if message has been successfully send, broadcast it to all users
        if (!posted.hasOwnProperty("error")) {
          chatService.broadcastPostedMessage(command.message, webSocketServer);
        }
        return posted;
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
