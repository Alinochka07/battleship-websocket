import WebSocket from 'ws';

export interface Player {
    id: number,
    name: string,
    password: string,
    wins: number,
    isLogged: boolean,
}

// Registration
export interface RegRequest {
    type: "reg",
    data: {
        name: string,
        password: string,
    },
    id: number,
}

export interface RegResponse {
    type: "reg";
    data: {
        name: string,
        index: number,
        error: boolean,
        errorText: string,
    },
    id: number
}

// Room
export interface CreateRoomResponse {
    type: "create_room",
    data: string,
    id: number
}

export interface AddUserToRoomResponse {
    type: "add_user_to_room",
        data: {
            indexRoom: number,
        },
    id: number
}

export interface UpdateRoomResponse {
    type: "update_room",
    data: {
        roomId: number,
        roomUsers: {
            name: string,
            index: number,
        }[],
    }[],
    id: 0,
}

// Game
export interface CreateGameResponse {
    type: "create_game", 
    data: {
        idGame: number,  
        idPlayer: number, // player id in the game 
    },
    id: number,
}

export interface CreateGameRequest {
    type: "create_game";
    id: number;
}


export interface StartGameResponse {
    type: "start_game",
    data: {
        ships: {
            position: {
                x: number,
                y: number,
            },
            direction: boolean,
            length: number,
            type: "small" | "medium" |"large" | "huge",
        }[],
        currentPlayerIndex: number, // id of the player in the current game who have sent his ships 
    },
    id: number,
}

// updating winners

export interface UpdateWinnersResponse {
    type: "update_winners",
    data: {
        name: string,
        wins: number,
    }[]
    id: number,
}

export interface CustomWebSocket extends WebSocket {
    playerId?: number; 
}
