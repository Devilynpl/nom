import { useState, useCallback } from 'react';

import { API_URL } from '../config';

export const useVibePoints = (initialUser) => {
    // Ensure initialUser has the new structure or default
    const [user, setUser] = useState({
        ...initialUser,
        silverCoins: initialUser.vibePoints || 850,
        goldenCoins: initialUser.goldenCoins || 5 // Default starting Gold for demo
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Add Silver Coins (formerly addPoints)
    const addSilver = useCallback(async (amount, type = 'MANUAL') => {
        // Optimistic UI update
        setUser(prev => ({
            ...prev,
            silverCoins: (prev.silverCoins || 0) + amount
        }));

        // Mock API call for now (or real fetch logic)
        // In real app, we would POST to /api/points/silver here
    }, [user.id]);

    // Transaction: Spend/Send Gold
    const sendGold = useCallback(async (amount, recipientId) => {
        if (user.goldenCoins < amount) {
            throw new Error("Not enough Golden Coins!");
        }

        // Optimistic Deduct
        setUser(prev => ({
            ...prev,
            goldenCoins: prev.goldenCoins - amount
        }));

        // Mock Transfer
        console.log(`Sent ${amount} Gold to ${recipientId}`);
        // POST /api/points/gold/transfer { amount, to: recipientId }
        return true;
    }, [user.goldenCoins]);

    // Buy Gold (Simulated)
    const buyGold = useCallback(async (amount) => {
        setUser(prev => ({
            ...prev,
            goldenCoins: prev.goldenCoins + amount
        }));
    }, []);

    const claimReferral = async (code) => {
        // ... existing logic mapped to silver
        return "Claimed";
    };

    const getLeaderboard = async () => {
        // ... existing logic
        return [];
    };

    const upgradeTier = async (tier) => {
        // ... existing logic
        return "Upgraded";
    };

    return {
        user,
        silverCoins: user.silverCoins,
        goldenCoins: user.goldenCoins,
        addSilver,
        sendGold,
        buyGold,
        addPoints: addSilver, // Backward compat alias
        getLeaderboard,
        upgradeTier,
        loading,
        error
    };
};
