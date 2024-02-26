import WebSocket, { Server as WebSocketServer } from 'ws';
import { Player, RegRequest, RegResponse, Room, UpdateRoomResponse } from './types';
import { registration } from './handlers/handleResRegistration';
import { updateRoomWinners } from './handlers/updateRoomWinners';

const players: Player[] = [];
const rooms: Room[] = [];
let roomIdCounter = 0;

const server = new WebSocketServer({
    port: 3000
});

ws.addEventListener('open', function () {
    console.log('WebSocket connection established.');
    
    // Construct the message to update room with winners
    const updateRoomWinnersMessage = {
        type: 'update_room_winners',
        data: {
            roomId: 123, // Replace with the actual room ID
            winners: ['Player1', 'Player2'] // Replace with the actual list of winners
        },
        id: 0
    };

    // Send the message to the server
    ws.send(JSON.stringify(updateRoomWinnersMessage));
});

ws.addEventListener('message', function (event) {
    console.log('Received message:', event.data);
});

ws.addEventListener('close', function () {
    console.log('WebSocket connection closed.');
});

server.on('connection', (ws) => {
    ws.on('message', async (message: string) => {
        const request: RegRequest = JSON.parse(message);
        if (request.type === 'reg') {
            await registration(request, ws);
        } else if (request.type === 'update_room_winners') {
            const { roomId, winners } = request.data;
            const room = rooms.find(room => room.id === roomId);
            if (room) {
                await updateRoomWinners(room, winners, server); 
            }
        }
    });

    ws.on('close', () => {
        console.log('Game over');
    });
});
