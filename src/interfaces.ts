export interface Player {
    id: number,
    name: string,
    password: string,
    wins: number,
    isLogged: boolean,
}


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
        name?: string,
        index?: number,
        error: boolean,
        errorText: string,
    },
    id: number
}

