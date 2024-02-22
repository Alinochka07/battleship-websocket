import { WebSocket } from "ws";
import { UpdateRoomResponse } from "../interfaces";



export const updateRoomWinners = async (ws: WebSocket) => {
    const updateRoom: UpdateRoomResponse = {
        type: 'update_room',
        data: [],
        id: 0
    }
}