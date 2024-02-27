import { WebSocket } from 'ws';
import { Player, RegRequest, RegResponse, Room } from "../types"

export const players: Player[] = [];
export const rooms: Room[] = [];

export const registration = async (request: RegRequest, ws: WebSocket) => {
    const response: RegResponse = {
        type: 'reg',
        data: {
            error: false,
            errorText: '',
            name: '',
            index: 0
        },
        id: request.id
    }
    try {
        const presentPlayer = players.find((player) => player.name === request.data.name);

        if (presentPlayer) {
            throw new Error('This username already exists');
        }
        const newPlayer: Player = {
            id: players.length,
            name: request.data.name,
            password: request.data.password,
            wins: 0,
            isLogged: true
        };
        players.push(newPlayer);
        response.data.name = newPlayer.name;
        response.data.index = newPlayer.id;

    } catch (error) {
        response.data.error = true;
        response.data.errorText = `Error during registering new player: ${error}`;
    }
    ws.send(JSON.stringify(response));
}

const server = new WebSocket.Server({
    port: 3000
});

server.on('connection', (ws) => {
    ws.on('message', async (message: string) => {
        if (ws.readyState !== WebSocket.OPEN) {
            return;
        }
        const request: RegRequest = JSON.parse(message);
        if (request.type === 'reg') {
            await registration(request, ws);
        }
    });

    ws.on('close', () => {
        console.log('Game over');
    });
});