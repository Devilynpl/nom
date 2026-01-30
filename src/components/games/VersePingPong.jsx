import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import { Mic, Send, Music } from 'lucide-react';
import './VersePingPong.css';

// const socket = io('http://localhost:5000'); // Moved inside component
let socket;

const VersePingPong = () => {
    const { user } = useAuth();
    const [roomId, setRoomId] = useState('');
    const [joined, setJoined] = useState(false);
    const [gameState, setGameState] = useState(null);
    const [currentLine, setCurrentLine] = useState('');

    useEffect(() => {
        if (!socket) socket = io('http://localhost:5000');

        socket.on('connect', () => console.log("Socket connected"));
        socket.on('disconnect', () => console.log("Socket disconnected"));

        socket.on('game_update', (data) => {
            setGameState(data);
        });

        return () => {
            socket.off('connect');
            socket.off('game_update');
            socket.disconnect(); // clean up
            socket = null;
        };
    }, []);

    const joinRoom = () => {
        if (!roomId) return;
        socket.emit('join_game', { roomId, username: user ? user.name : 'Guest' });
        setJoined(true);
    };

    const sendLine = (e) => {
        e.preventDefault();
        if (!currentLine) return;
        socket.emit('send_line', { roomId, line: currentLine, username: user ? user.name : 'Guest' });
        setCurrentLine('');
    };

    if (!joined) {
        return (
            <div className="game-lobby glass animate-fade">
                <h1><Mic className="accent-gold" /> Verse Ping Pong 🏓</h1>
                <p>Create or join a room to start battling.</p>
                <div className="lobby-controls">
                    <input
                        type="text"
                        placeholder="Enter Room Code (e.g. RAP1)"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                    />
                    <button onClick={joinRoom} className="premium-button">Enter Arena</button>
                </div>
            </div>
        );
    }

    return (
        <div className="game-arena animate-fade">
            <div className="game-header">
                <h2>Room: {roomId}</h2>
                <div className="players">
                    {gameState?.players.map((p, i) => (
                        <div key={i} className="player-badge">
                            {p.username}
                        </div>
                    ))}
                </div>
            </div>

            <div className="rhyme-feed glass">
                {gameState?.lines.length === 0 && <div className="empty-state">Waiting for the first bar...</div>}

                {gameState?.lines.map((item, i) => (
                    <div key={i} className={`rhyme-bubble ${item.username === user?.name ? 'mine' : 'opponent'}`}>
                        <span className="rhyme-author">{item.username}</span>
                        <p>{item.text}</p>
                    </div>
                ))}
            </div>

            <form className="rhyme-input" onSubmit={sendLine}>
                <input
                    type="text"
                    value={currentLine}
                    onChange={(e) => setCurrentLine(e.target.value)}
                    placeholder="Drop a bar..."
                    autoFocus
                />
                <button type="submit"><Send size={20} /></button>
            </form>
        </div>
    );
};

export default VersePingPong;
