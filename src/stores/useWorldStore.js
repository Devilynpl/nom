import { create } from 'zustand';
import { io } from 'socket.io-client';

const URL = 'http://localhost:5000';

export const useWorldStore = create((set, get) => ({
    socket: null,
    players: {}, // id -> { position: {x,y,z}, rotation: {x,y,z} }

    connect: () => {
        if (get().socket) return;

        const socket = io(URL);

        socket.on('connect', () => {
            console.log('Connected to World Socket:', socket.id);
        });

        socket.on('player_update', (data) => {
            // data: { id, position, rotation }
            set((state) => ({
                players: { ...state.players, [data.id]: data }
            }));
        });

        socket.on('player_left', ({ id }) => {
            set((state) => {
                const newPlayers = { ...state.players };
                delete newPlayers[id];
                return { players: newPlayers };
            });
        });

        set({ socket });
    },

    sendUpdate: (data) => {
        const { socket } = get();
        if (socket && socket.connected) {
            socket.emit('player_move', data);
        }
    }
}));
