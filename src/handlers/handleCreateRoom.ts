import { WebSocket } from 'ws';
import { CreateRoom, Player, RegRequest, Room } from "../types"
import { registration } from './handleResRegistration';

export const players: Player[] = [];
export const rooms: Room[] = [];
let roomIdCounter = 0;

export const createRoom = (playerName: string) => {
    const newRoom: Room = {
        roomId: roomIdCounter++,
        roomUsers: [{ name: playerName, index: 0 }],
    };
    rooms.push(newRoom);
    return newRoom;
}

const server = new WebSocket.Server({
    port: 3000
});

server.on('connection', (ws) => {
    ws.on('message', async (message: string) => {
        const request: RegRequest | CreateRoom = JSON.parse(message);
        if (request.type === 'reg') {
            await registration(request, ws);
        } else if (request.type === 'create_room') {
            const playerName = request.data; 
            const room = createRoom(playerName);
            ws.send(JSON.stringify({ type: 'room_created', data: room }));
        }
    });

    ws.on('close', () => {
        console.log('Game over');
    });
});