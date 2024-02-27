import { httpServer } from "./src/http_server/index.js";
import { WebSocketServer } from "ws";


const ws = new WebSocketServer({ server: httpServer });

ws.addListener('open', function () {
    console.log('WebSocket connection established.');
    ws.send(JSON.stringify({ type: 'reg', data: { name: 'example', password: 'password' } }));
});

ws.addListener('message', function (event) {
    console.log('Received message:', event.data);
});

ws.addListener('close', function () {
    console.log('WebSocket connection closed.');
});

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);


// const server = new WebSocket.Server({
//     port: 8181
// });

// server.on('connection', (ws) => {
//     ws.on('message', async (message: string) => {
//         const request: RegRequest = JSON.parse(message);
//         if (request.type === 'reg') {
//             await registration(request, ws);
//         }
//     });

//     ws.on('close', () => {
//         console.log('Game over');
//     });
// });