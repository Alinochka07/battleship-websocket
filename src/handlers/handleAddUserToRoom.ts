import WebSocket from "ws";
import { AddUserToRoom, CreateGameResponse, CustomWebSocket } from "../types";
import { getOtherPlayersInTheRoom } from "./getOtherPlayersInTheRoom";


let gameIdCounter = 0;

export const handleAddUserToRoomRequest = (ws: WebSocket, request: AddUserToRoom) => {
    if (!isCustomWebSocket(ws)) {
        throw new Error('Invalid WebSocket: Missing playerId');
    }
    const gameId = gameIdCounter++;

    const playersIds: number[] = [];

    if (ws.playerId !== undefined) {
    playersIds.push(ws.playerId);
    }

    const createGameResponse: CreateGameResponse = {
        type: "create_game",
        data: {
            idGame: gameId,
            idPlayer: playersIds[1]
        },
        id: 0
    };
    ws.send(JSON.stringify(createGameResponse));

    const otherPlayers = getOtherPlayersInTheRoom(ws);
    otherPlayers.forEach(player => {
        const otherWs = player.ws;
        if (otherWs) {
            otherWs.send(JSON.stringify(createGameResponse));
        }
    })
}


function isCustomWebSocket(ws: WebSocket): ws is CustomWebSocket {
    return (ws as CustomWebSocket).playerId !== undefined;
}