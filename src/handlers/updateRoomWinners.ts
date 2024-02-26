import WebSocket, { WebSocketServer } from 'ws';
import { RegRequest, Room, UpdateRoomResponse } from '../types';
import { registration } from './handleResRegistration'; 

export const updateRoom = async (roomId: number, roomUsers: any[], wss: WebSocket.Server) => {
    try {
        const updateRoomResponse: UpdateRoomResponse = {
            type: 'update_room',
            data: [{ roomId, roomUsers }],
            id: 0
        };

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(updateRoomResponse));
            }
        });
    } catch (error) {
        console.error('Error updating room:', error);
    }
};

const rooms: Map<number, Room> = new Map();


const fetchRoomData = (roomId: number): Room | undefined => {
    return rooms.get(roomId);
};

export const updateWinners = async (roomId: number, winners: string[], wss: WebSocket.Server) => {
    try {
        const roomData = fetchRoomData(roomId);

        if (roomData) {
            roomData.winners = winners;
            await updateRoom(roomId, roomData.roomUsers, wss);
        }
    } catch (error) {
        console.error('Error updating winners:', error);
    }
};

const server = new WebSocketServer({
    port: 3000
});

server.on('connection', (ws) => {
    ws.on('message', async (message: string) => {
        try {
            const request: RegRequest = JSON.parse(message);
            if (request.type === 'reg') {
                await registration(request, ws);
            } else if (request.type === 'update_room') {
                const { roomId, roomUsers } = request.data;
                await updateRoom(roomId, roomUsers, server);
            } else if (request.type === 'update_winners') {
                const { roomId, winners } = request.data;
                await updateWinners(roomId, winners, server);
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed.');
    });
});

