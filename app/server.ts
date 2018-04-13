import express from 'express';
import http from 'http';
import WebSocket from 'ws';

import { WelcomeController } from './controllers';

const app: express.Application = express();

const port: number = 3000;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {

        //log the received message and send it back to the client
        console.log('received: %s', message);
        ws.send(`Hello, you sent -> ${message}`);
    });

    //send immediatly a feedback to the incoming connection
    ws.send('Hi there, I am a WebSocket server');
  });


app.use('/welcome', WelcomeController);

server.listen(port, () => {
  // Success callback
  console.log(`Listening at http://localhost:${port}/`);
});
