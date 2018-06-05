import * as os from 'os';

export const environment = {
  CouchCredentials: {
    host: "http://bigbluewhale",
    port: 5984,
    auth: {
      username: "admin",
      password: "node-chat-backend"
    }
  },
  hostname: os.hostname(),
  port: process.env.PORT || 3000,
  auth: {
    user: process.env.DHBW_USER || "dhbw",
    password: process.env.DHBW_PASSWORD || "dhbw-pw"
  }
};
