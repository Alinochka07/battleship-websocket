import { WebSocket } from 'ws';
import { CustomWebSocket, CreateGameRequest, CreateGameResponse } from "../interfaces";
import { getOtherPlayersInTheRoom } from './getOtherPlayersInTheRoom';

let gameIdCounter = 0;
export const gamePlayer: Map<number, number[]> = new Map();

function isCustomWebSocket(ws: WebSocket): ws is CustomWebSocket {
    return (ws as CustomWebSocket).playerId !== undefined;
}

export const handleCreateGame = async (request: CreateGameRequest, ws: WebSocket) => {
    if (!isCustomWebSocket(ws)) {
        throw new Error('Invalid WebSocket: Missing playerId');
    }
    const gameId = gameIdCounter++;

    const playersIds: number[] = [];

    if (ws.playerId !== undefined) {
    playersIds.push(ws.playerId);
    }

    if (playersIds.length > 0) {
    gamePlayer.set(gameId, playersIds);
    } else {
        throw new Error('No players associated with WebSocket');
    }

    const gameResponse: CreateGameResponse = {
        type: 'create_game',
        data: {
            idGame: gameId,
            idPlayer: playersIds[0],
        },
        id: request.id
    };
    ws.send(JSON.stringify(gameResponse));

    const otherPlayers = getOtherPlayersInTheRoom(ws);
    otherPlayers.forEach(player => {
        const otherWs = player.ws;
        if (otherWs) {
            otherWs.send(JSON.stringify(gameResponse));
        }
    }); 
}
