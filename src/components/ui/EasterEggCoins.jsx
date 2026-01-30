import { useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import './EasterEggCoins.css';
import goldCoin from '../../assets/images/gold_badge.jpg';
import silverCoin from '../../assets/images/silver_badge.jpg';

const COIN_TYPES = {
    SILVER: { value: 1, image: silverCoin, name: 'Silver' },
    GOLD: { value: 5, image: goldCoin, name: 'Gold' }
};

const SPAWN_CONFIG = {
    minInterval: 120000, // 2 minutes minimum
    maxInterval: 300000, // 5 minutes maximum
    displayDuration: 5000, // 5 seconds to click
    goldChance: 0.15, // 15% chance for gold
    sessionKey: 'vibe_coin_spawned' // LocalStorage key
};

/**
 * EasterEggCoins - Random coin spawner for gamification
 * Spawns maximum ONCE per session at a random time
 */
const EasterEggCoins = ({ onCoinCollected }) => {
    const [activeCoin, setActiveCoin] = useState(null);
    const [hasSpawned, setHasSpawned] = useState(false);

    const spawnCoin = useCallback(() => {
        // Check if already spawned this session
        if (sessionStorage.getItem(SPAWN_CONFIG.sessionKey)) {
            return;
        }

        // Random coin type
        const isGold = Math.random() < SPAWN_CONFIG.goldChance;
        const coinType = isGold ? COIN_TYPES.GOLD : COIN_TYPES.SILVER;

        // Random position (avoid edges)
        const x = Math.random() * (window.innerWidth - 120) + 60;
        const y = Math.random() * (window.innerHeight - 120) + 60;

        const coin = {
            id: Date.now(),
            type: coinType,
            x,
            y
        };

        setActiveCoin(coin);
        setHasSpawned(true);
        sessionStorage.setItem(SPAWN_CONFIG.sessionKey, 'true');

        // Auto-remove after display duration
        setTimeout(() => {
            setActiveCoin(prev => prev?.id === coin.id ? null : prev);
        }, SPAWN_CONFIG.displayDuration);
    }, []);

    const handleCoinClick = useCallback((coin) => {
        // Animate collection
        const coinElement = document.getElementById(`coin-${coin.id}`);
        if (coinElement) {
            gsap.to(coinElement, {
                scale: 2,
                rotation: 720,
                opacity: 0,
                y: -100,
                duration: 0.6,
                ease: 'back.in(1.7)',
                onComplete: () => {
                    setActiveCoin(null);
                    if (onCoinCollected) {
                        onCoinCollected(coin.type.name.toLowerCase(), coin.type.value);
                    }
                }
            });
        }
    }, [onCoinCollected]);

    useEffect(() => {
        // Check if already spawned this session
        if (sessionStorage.getItem(SPAWN_CONFIG.sessionKey)) {
            setHasSpawned(true);
            return;
        }

        // Schedule ONE spawn at random time
        const delay = Math.random() * (SPAWN_CONFIG.maxInterval - SPAWN_CONFIG.minInterval) + SPAWN_CONFIG.minInterval;
        const timeoutId = setTimeout(spawnCoin, delay);

        return () => clearTimeout(timeoutId);
    }, [spawnCoin]);

    if (!activeCoin || hasSpawned && !activeCoin) return null;

    return (
        <div
            id={`coin-${activeCoin.id}`}
            className="easter-egg-coin"
            style={{
                left: `${activeCoin.x}px`,
                top: `${activeCoin.y}px`
            }}
            onClick={() => handleCoinClick(activeCoin)}
            title={`Click to collect ${activeCoin.type.name} coin!`}
        >
            <div className="coin-inner">
                <img
                    src={activeCoin.type.image}
                    alt={`${activeCoin.type.name} Coin`}
                    className="coin-image"
                />
            </div>
            <div className="coin-glow"></div>
            <div className="coin-sparkles">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="sparkle" style={{ '--i': i }} />
                ))}
            </div>
        </div>
    );
};

export default EasterEggCoins;
