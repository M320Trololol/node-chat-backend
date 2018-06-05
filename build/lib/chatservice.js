"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_couchdb_client_1 = require("@teammaestro/node-couchdb-client");
// Instatiate new CouchDB request class
const db = new node_couchdb_client_1.CouchDb({
    host: "http://m320trololol.com",
    port: 5984,
    auth: {
        username: "admin",
        password: "node-chat-backend"
    }
});
function getChatRooms() {
    return __awaiter(this, void 0, void 0, function* () {
        var rooms = yield db.getDocuments({
            dbName: "rooms",
            options: { include_docs: true }
        });
        let result = [];
        rooms.rows.forEach(element => {
            if (element.doc) {
                var room = {};
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
    });
}
exports.getChatRooms = getChatRooms;
function getMessagesInRoom(roomName) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingRooms = yield db.findDocuments({
            dbName: "rooms",
            findOptions: { selector: { roomName: roomName } }
        });
        let rooms = [];
        existingRooms.docs.forEach(document => rooms.push(document.roomName));
        if (rooms.indexOf(roomName) > -1) {
            var messages = yield db.findDocuments({
                dbName: "messages",
                findOptions: { selector: { roomName: roomName } }
            });
            let result = [];
            messages.docs.forEach(document => {
                if (document) {
                    var message = {};
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
        }
        else {
            return { error: `There is no Room ${roomName}. Create it first!` };
        }
    });
}
exports.getMessagesInRoom = getMessagesInRoom;
function createChatRoom(roomName, creator) {
    return __awaiter(this, void 0, void 0, function* () {
        const room = {
            roomName: roomName,
            created: new Date(Date.now()),
            owners: [creator],
            users: [creator]
        };
        const existingRooms = yield db.findDocuments({
            dbName: "rooms",
            findOptions: { selector: { roomName: roomName } }
        });
        if (existingRooms.docs.length > 0) {
            return Promise.reject(new Error(`Room ${roomName} already exists`));
        }
        return db.createDocument({ doc: room, dbName: "rooms" });
    });
}
exports.createChatRoom = createChatRoom;
function joinChatRoom(roomName, joining) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingRooms = yield db.findDocuments({
            dbName: "rooms",
            findOptions: { selector: { roomName: roomName } }
        });
        if (existingRooms.docs.length > 0) {
            if (existingRooms.docs.length < 2) {
                let joinedUsers = [];
                existingRooms.docs[0].users.forEach((user) => {
                    joinedUsers.push(user.userName);
                });
                if (joinedUsers.indexOf(joining.userName) > -1) {
                    return Promise.reject(new Error(`User ${joining.userName} already in Room ${roomName}`));
                }
                else {
                    let newUsers = existingRooms.docs[0].users;
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
            }
            else {
                return Promise.reject(new Error(`Room ${roomName} has duplictes!`));
                //TODO: delete duplicates
            }
        }
        else {
            return Promise.reject(new Error(`Room ${roomName} doesn't exist, create it first`));
        }
    });
}
exports.joinChatRoom = joinChatRoom;
function postMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingRooms = yield db.findDocuments({
            dbName: "rooms",
            findOptions: { selector: { roomName: message.roomName } }
        });
        let rooms = [];
        existingRooms.docs.forEach(document => rooms.push(document.roomName));
        if (rooms.indexOf(message.roomName) > -1) {
            if (rooms[rooms.indexOf(message.roomName)]) {
                return db.createDocument({ doc: message, dbName: "messages" });
            }
            else {
                return Promise.reject(new Error(`User ${message.user.userName} hasn't joined the room, join it first!`));
            }
        }
        else {
            return Promise.reject(new Error(`Room ${message.roomName} doesn't exist, create and join it first`));
        }
    });
}
exports.postMessage = postMessage;
function getUsersInRoom(roomName) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingRooms = yield db.findDocuments({
            dbName: "rooms",
            findOptions: { selector: { roomName: roomName } }
        });
        let rooms = [];
        existingRooms.docs.forEach(document => rooms.push(document.roomName));
        if (rooms.indexOf(roomName) > -1) {
            let result = existingRooms.docs[0].users;
            return {
                action: "getUsersInRoom",
                roomName: roomName,
                users: result
            };
        }
        else {
            return { error: `There is no Room ${roomName}. Create it first!` };
        }
    });
}
exports.getUsersInRoom = getUsersInRoom;
// export function postPrivateMessage(userId, {user, message, meta}) {
//   if(!userId || !user || !message) {
//     return Promise.reject(new Error('Recipient, User, Message must be defined'));
//   }
//   // create private conversation as new chat-room
//   const roomId = getPrivateChatRoomName(userId, user);
//   return db.storeMessage(roomId, true, {user, message, meta, timestamp: Date.now()});
// }
// export function getPrivateChatRoomName(userA, userB) {
//   return userA < userB ? `${userA}_x_${userB}`: `${userB}_x_${userA}`;
// }
module.exports = {
    getChatRooms,
    createChatRoom,
    joinChatRoom,
    getMessagesInRoom,
    postMessage,
    getUsersInRoom
    // postPrivateMessage,
    // getPrivateChatRoomName
};
//# sourceMappingURL=chatservice.js.map