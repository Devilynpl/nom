import { create } from 'zustand';
import { io } from 'socket.io-client';

import { SOCKET_URL } from '../config';

export const useSocketStore = create((set, get) => ({
    socket: null,
    isConnected: false,

    // Actions
    connect: () => {
        const { socket } = get();
        if (socket) return; // Already connected

        const newSocket = io(SOCKET_URL);

        newSocket.on('connect', () => {
            console.log('Socket Connected:', newSocket.id);
            set({ isConnected: true });
        });

        newSocket.on('disconnect', () => {
            console.log('Socket Disconnected');
            set({ isConnected: false });
        });

        // Listen for remote events and sync with PlayerStore
        // This allows "Listen Together" functionality
        newSocket.on('remote:play', (track) => {
            import('./usePlayerStore').then(({ usePlayerStore }) => {
                usePlayerStore.getState().playTrack(track);
            });
        });

        newSocket.on('remote:pause', () => {
            import('./usePlayerStore').then(({ usePlayerStore }) => {
                usePlayerStore.getState().pause();
            });
        });

        set({ socket: newSocket });
    },

    disconnect: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null, isConnected: false });
        }
    },

    // Helper to abstract emission
    emit: (event, data) => {
        const { socket } = get();
        if (socket) socket.emit(event, data);
    }
}));
