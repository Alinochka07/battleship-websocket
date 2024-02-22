import { WebSocket } from 'ws';
import { getRoomForPlayer } from './getRoomForPlayer';

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


