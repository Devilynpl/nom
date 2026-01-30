import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import { Swords, Send, Trophy, Clock, Loader2 } from 'lucide-react';
import './RapBattleArena.css';
import imgBronze from '../../assets/images/bronze_badge.jpg';

// const socket = io('http://localhost:5000');
let socket;

const RapBattleArena = () => {
    const { user } = useAuth();
    const [status, setStatus] = useState('IDLE'); // IDLE, QUEUE, BATTLE, RESULT
    const [roomId, setRoomId] = useState(null);
    const [gameState, setGameState] = useState(null);
    const [currentLine, setCurrentLine] = useState('');
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        if (!socket) socket = io('http://localhost:5000');

        socket.on('connect', () => console.log('Arena Connected'));

        socket.on('game_start', ({ roomId, players }) => {
            setRoomId(roomId);
            setGameState({ players, lines: [], turn: 0 });
            setStatus('BATTLE');
        });

        socket.on('game_update', (data) => {
            setGameState(data);
        });

        return () => {
            socket.off('game_start');
            socket.off('game_update');
            socket.disconnect();
            socket = null;
        };
    }, []);

    const joinQueue = () => {
        setStatus('QUEUE');
        socket.emit('join_queue', { username: user ? user.name : 'MC Guest' });
    };

    const sendBar = (e) => {
        e.preventDefault();
        if (!currentLine) return;
        socket.emit('send_line', { roomId, line: currentLine, username: user ? user.name : 'MC Guest' });
        setCurrentLine('');
    };

    if (status === 'IDLE') {
        return (
            <div className="arena-lobby animate-fade">
                <div className="arena-hero">
                    <Swords size={64} className="accent-red" />
                    <h1>Ranked Battle Arena</h1>
                    <p>Compete against other MCs in real-time. Win to climb the ladder.</p>
                    <button className="battle-btn" onClick={joinQueue}>FIND MATCH</button>
                    <div className="rank-display">
                        <img src={imgBronze} alt="Rank" className="rank-icon" style={{ width: '60px', borderRadius: '50%', marginTop: '1rem' }} />
                        <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>Rank: Bronze II</div>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'QUEUE') {
        return (
            <div className="arena-queue animate-fade">
                <Loader2 size={64} className="spin accent-gold" />
                <h2>Searching for Opponent...</h2>
                <p>Sharpening rhymes...</p>
            </div>
        );
    }

    return (
        <div className="arena-battle animate-fade">
            <div className="battle-header">
                <div className="player p1">
                    <span className="name">{gameState?.players[0].username}</span>
                    <span className="score">0 PTS</span>
                </div>
                <div className="vs-timer">
                    <Clock size={20} />
                    <span>{timeLeft}s</span>
                </div>
                <div className="player p2">
                    <span className="name">{gameState?.players[1].username}</span>
                    <span className="score">0 PTS</span>
                </div>
            </div>

            <div className="battle-feed glass">
                {gameState?.lines.map((line, i) => (
                    <div key={i} className={`battle-bubble ${line.username === (user?.name || 'MC Guest') ? 'mine' : 'opponent'}`}>
                        <div className="bubble-meta">{line.username}</div>
                        <div className="bubble-text">{line.text}</div>
                    </div>
                ))}
            </div>

            <form className="battle-input" onSubmit={sendBar}>
                <input
                    type="text"
                    value={currentLine}
                    onChange={(e) => setCurrentLine(e.target.value)}
                    placeholder="Spit fire..."
                    autoFocus
                />
                <button type="submit"><Send size={24} /></button>
            </form>
        </div>
    );
};

export default RapBattleArena;
