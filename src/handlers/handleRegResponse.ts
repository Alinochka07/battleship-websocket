import WebSocket from "ws";
import { RegResponse, UpdateRoomResponse, UpdateWinnersResponse } from "../interfaces";
import { players } from "./handleResRegistration";


let roomIdCounter = 0;

export const handleRegResponse = (ws: WebSocket, response: RegResponse) => {
    if (!response.data.error) {
        const getRoomsData = () => {
            const data: { roomId: number; roomUsers: { name: string; index: number; }[]; }[] = [];
            players.forEach(player => {
                const roomUsers = {
                    name: player.name,
                    index: player.id
                };
                data.push({
                    roomId: roomIdCounter++,
                    roomUsers: [roomUsers]
                })
            });
            return data;
        }

        const updateRoomResponse: UpdateRoomResponse = {
            type: "update_room",
            data: getRoomsData(),
            id: 0
        }
        broadcastResponseToAll(updateRoomResponse);

        const getWinnersData = () => {
            const data: { name: string; wins: number; }[] = [];
            players.forEach(player => {
                data.push({
                    name: player.name,
                    wins: player.wins
                })
            });
            return data;
        }

        const updateWinnersResponse: UpdateWinnersResponse = {
            type: "update_winners",
            data: getWinnersData(),
            id: 0
        };
        ws.send(JSON.stringify(updateWinnersResponse));
    }
}

const server = new WebSocket.Server({ port: 8181 });

const broadcastResponseToAll = (response: any) => {
    server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(response));
        }
    });
};

