import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from './AuthContext';
import './NotificationToast.css';

// Initialize Supabase (reuse from AuthContext logic or import robust client)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const { user } = useAuth();

    // Define helper functions BEFORE useEffect to avoid ReferenceError in dependency array
    const getToastType = (type) => {
        switch (type) {
            case 'POINTS': return 'success';
            case 'alert': return 'error';
            default: return 'info';
        }
    };

    const addNotification = useCallback((message, type = 'info') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    // Effect uses addNotification, so it must be defined after it
    useEffect(() => {
        if (!user || !supabase) return;

        let channel = null;

        const init = async () => {
            try {
                // 1. Fetch unread notifications
                const { data, error } = await supabase
                    .from('notifications')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (!error && data) {
                    // Logic to load initial notifications if needed
                }

                // 2. Realtime Subscription
                channel = supabase
                    .channel('public:notifications')
                    .on(
                        'postgres_changes',
                        {
                            event: 'INSERT',
                            schema: 'public',
                            table: 'notifications',
                            filter: `user_id=eq.${user.id}`
                        },
                        (payload) => {
                            const newNotif = payload.new;
                            addNotification(newNotif.message, getToastType(newNotif.type));
                        }
                    )
                    .subscribe();

            } catch (error) {
                console.error("Notification setup failed:", error);
            }
        };

        init();

        return () => {
            if (channel && supabase) {
                supabase.removeChannel(channel);
            }
        };
    }, [user, addNotification]);

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            <div className="notification-container">
                {notifications.map(notif => (
                    <div
                        key={notif.id}
                        className={`notification-toast ${notif.type} animate-slide-in`}
                        onClick={() => removeNotification(notif.id)}
                    >
                        <span className="toast-icon">
                            {notif.type === 'success' && '🏆'}
                            {notif.type === 'error' && '⚠️'}
                            {notif.type === 'info' && '📩'}
                        </span>
                        <span className="toast-message">{notif.message}</span>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};
