"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_couchdb_client_1 = require("@teammaestro/node-couchdb-client");
// Instatiate new CouchDB request class
const db = new node_couchdb_client_1.CouchDb({
    host: 'http://m320trololol.com',
    port: 5984,
    auth: {
        username: 'admin',
        password: 'node-chat-backend'
    }
});
function getChatRooms() {
    let rooms = db.getDocuments({ dbName: 'rooms', options: { include_docs: true } });
    rooms.then((value) => {
        let result = [];
        value.rows.forEach(element => {
            if (element.doc) {
                result.push(element.doc.name);
            }
        });
        console.log(result);
        return result;
    }, (reason) => {
        console.error("Rooms could not be retrieved, reason: " + reason);
        return reason;
    });
}
exports.getChatRooms = getChatRooms;
;
function getMessagesInRoom(roomId) {
    if (!roomId) {
        return Promise.reject(new Error('Room must be defined'));
    }
    return db.findDocuments({
        dbName: 'messages',
        findOptions: {
            selector: {
                "room": roomId
            }
        }
    });
}
exports.getMessagesInRoom = getMessagesInRoom;
// export function postMessage(roomId: string, {user, message, meta}) {
//   if(!roomId || !user || !message) {
//     return Promise.reject(new Error('Room, User, Message must be defined'));
//   }
//   return db.storeMessage(roomId, false, {user, message, meta, timestamp: Date.now()});
// }
// export function getUsersInRoom(roomId) {
//   if(!roomId) {
//     return Promise.reject(new Error('Room must be defined'));
//   }
//   return db.loadUsers(roomId);
// }
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
    getMessagesInRoom,
};
//# sourceMappingURL=chatservice.js.map