import { WebSocket } from 'ws';
import { CustomWebSocket } from "../interfaces";
import { gamePlayer } from './handleCreateGame';

const roomPlayerMap: Map<number, WebSocket[]> = new Map();

export const getOtherPlayersInTheRoom = (ws: WebSocket): { ws: WebSocket, playerId: number }[] => {
    const room = getRoomForPlayer(ws);
    if (room === undefined) {
        return [];
    }
    const playersInRoom = roomPlayerMap.get(room) || [];
    const otherPlayers = playersInRoom.filter(player => player !== ws);
    const otherPlayersWithId = otherPlayers.map(player => ({
        ws: player,
        playerId: (player as any).playerId
    }));
    return otherPlayersWithId;
}

export const getRoomForPlayer = (ws: WebSocket): number | undefined => {
    const gameForPlayer = gamePlayer.get((ws as CustomWebSocket).playerId as number);
    if (gameForPlayer === undefined) {
        return undefined;
    } else {
        for (const [gameId, playersIds] of gamePlayer.entries()) {
            if (playersIds.includes((ws as CustomWebSocket).playerId as number)) {
                return gameId;
            }
        }
    }
    return undefined;
}
