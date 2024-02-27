import { WebSocket } from 'ws';
import { CustomWebSocket } from "../types";
import { gamePlayer } from './handleCreateGame';


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