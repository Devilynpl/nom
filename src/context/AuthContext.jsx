import React, { createContext, useState, useContext, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { USER_GROUPS, getGroupById } from '../constants/groups';

// Initialize Supabase Client (safe fallback if env vars missing)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || '';
const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;

const AuthContext = createContext();

/**
 * Context Provider for Authentication and User Authorization.
 * Handles both real Supabase authentication and a local Mock fallback.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to be wrapped.
 * @returns {JSX.Element} The AuthProvider component.
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let subscription = null;

        const checkUser = async () => {
            try {
                if (supabase) {
                    const { data, error } = await supabase.auth.getSession();
                    if (error) throw error;


                    if (data.session) {
                        if (data.session.user) {
                            // Force Admin for specific user
                            if (data.session.user.email === 'morbidnoizz@gmail.com' || data.session.user.email === 'admin@vibe.music') {
                                data.session.user.user_metadata = {
                                    ...data.session.user.user_metadata,
                                    group_id: USER_GROUPS.ADMINISTRATOR.id,
                                    role: 'admin'
                                };
                                console.log("Administrator role forced for:", data.session.user.email);
                            } else if (!data.session.user.user_metadata.group_id) {
                                // Default to Listener for regular logged in users
                                data.session.user.user_metadata.group_id = USER_GROUPS.LISTENER.id;
                            }
                        }
                        setSession(data.session);
                        setUser(data.session.user);
                    } else {
                        // No Supabase session found? Check localStorage fallback!
                        const storedUser = localStorage.getItem('vibe_mock_user');
                        if (storedUser) {
                            try {
                                let parsedUser = JSON.parse(storedUser);
                                // Ensure legacy mock users get updated role check
                                if (parsedUser.email === 'morbidnoizz@gmail.com') {
                                    parsedUser.user_metadata.role = 'admin';
                                }
                                setUser(parsedUser);
                                console.log("Restored mock user from localStorage:", parsedUser.email);
                            } catch (e) {
                                console.error("Failed to parse stored user", e);
                            }
                        } else {
                            // Truly logged out
                            setSession(null);
                            setUser(null);
                        }
                    }

                    const { data: subData } = supabase.auth.onAuthStateChange((_event, session) => {
                        if (session?.user) {
                            if (session.user.email === 'morbidnoizz@gmail.com' || session.user.email === 'admin@vibe.music') {
                                session.user.user_metadata = {
                                    ...session.user.user_metadata,
                                    role: 'admin'
                                };
                            }
                        }
                        setSession(session);
                        setUser(session?.user || null);
                    });
                    subscription = subData.subscription;
                } else {
                    // MOCK MODE: Check localStorage
                    const storedUser = localStorage.getItem('vibe_mock_user');
                    if (storedUser) {
                        try {
                            let parsedUser = JSON.parse(storedUser);
                            // Ensure legacy mock users get updated role check
                            if (parsedUser.email === 'morbidnoizz@gmail.com') {
                                parsedUser.user_metadata.role = 'admin';
                            }
                            setUser(parsedUser);
                        } catch (e) {
                            console.error("Failed to parse stored user", e);
                        }
                    }
                }
            } catch (err) {
                console.warn("Auth initialization failed (using mock fallbacks):", err);
                // Fallback: If auth fails, we can optionally set a mock user or just let them login
            } finally {
                setLoading(false);
            }
        };

        checkUser();

        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, []);

    const loginGoogle = async () => {
        try {
            if (supabase) {
                const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
                if (error) throw error;
            } else {
                throw new Error("Supabase not configured");
            }
        } catch (err) {
            console.warn("Google Login failed (likely disabled in Supabase):", err.message);
            // Fallback to Mock Login for development if real auth fails
            mockLogin('google_user', { username: 'Google User' });
        }
    };

    const login = async (email, password) => {
        try {
            if (supabase) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                mockLogin(email);
            }
        } catch (err) {
            console.warn("Login failed (attempting mock fallback):", err.message);
            // Fallback for Guest OR specific Admin/Dev accounts we want to allow mocking for
            const isMockableAccount = email.includes('guest') ||
                email === 'morbidnoizz@gmail.com' ||
                email === 'admin@vibe.music';

            if (isMockableAccount || err.message.includes('configured')) {
                mockLogin(email, { username: email.split('@')[0] });
            } else {
                throw err; // Real errors for real regular users should propagate
            }
        }
    };

    const register = async (email, password, metadata) => {
        try {
            if (supabase) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: metadata }
                });
                if (error) throw error;
            } else {
                throw new Error("Supabase not configured");
            }
        } catch (err) {
            console.warn("Registration failed (using Mock):", err.message);
            // Fallback to Mock Login for instant access
            mockLogin(email, metadata);
        }
    };

    const logout = async () => {
        // ALWAYS clear mock user first
        localStorage.removeItem('vibe_mock_user');

        if (supabase) {
            await supabase.auth.signOut();
        }
        setUser(null);
    };

    // --- MOCK DATABASE HELPERS (For Admin Demo) ---

    const getMockUsersDB = () => {
        try {
            return JSON.parse(localStorage.getItem('vibe_mock_users_db') || '[]');
        } catch {
            return [];
        }
    };

    const saveMockUserToDB = (user) => {
        const db = getMockUsersDB();
        const index = db.findIndex(u => u.email === user.email);
        if (index >= 0) {
            db[index] = { ...db[index], ...user }; // Update
        } else {
            db.push(user); // Insert
        }
        localStorage.setItem('vibe_mock_users_db', JSON.stringify(db));
    };

    const getMockUser = (email) => {
        const db = getMockUsersDB();
        return db.find(u => u.email === email);
    };

    // Helper for mock mode
    const mockLogin = (identifier, metadata = {}) => {
        const isEmail = identifier.includes('@');
        const email = isEmail ? identifier : `${identifier}@vibe.music`;

        // 1. Check if user exists in Mock DB to retrieve their persisted role
        let existingUser = getMockUser(email);

        // 2. Default Role Logic (if new user)
        // Hardcoded Super Admin for bootstrap, otherwise 'user'
        const isSuperAdmin = email === 'admin@vibe.music' || email === 'morbidnoizz@gmail.com';
        const defaultGroupId = isSuperAdmin ? USER_GROUPS.ADMINISTRATOR.id : USER_GROUPS.LISTENER.id;

        const mockUser = {
            id: existingUser?.id || identifier || `user_${Date.now()}`,
            email: email,
            user_metadata: {
                username: metadata.username || identifier.split('@')[0],
                group_id: existingUser?.user_metadata?.group_id || defaultGroupId, // Persist group!
                role: existingUser?.user_metadata?.role || (isSuperAdmin ? 'admin' : 'user'),
                ...metadata
            }
        };

        // 3. Save to DB and Set Session
        saveMockUserToDB(mockUser);
        localStorage.setItem('vibe_mock_user', JSON.stringify(mockUser));
        setUser(mockUser);
    };

    // Admin Function: Update User Group
    const updateUserGroup = (targetEmail, groupId) => {
        const db = getMockUsersDB();
        const index = db.findIndex(u => u.email === targetEmail);
        if (index !== -1) {
            db[index].user_metadata.group_id = groupId;
            localStorage.setItem('vibe_mock_users_db', JSON.stringify(db));

            // If updating self, update state
            if (user && user.email === targetEmail) {
                const updatedUser = { ...user, user_metadata: { ...user.user_metadata, group_id: groupId } };
                setUser(updatedUser);
                localStorage.setItem('vibe_mock_user', JSON.stringify(updatedUser));
            }
            return true;
        }
        return false;
    };

    const getAllUsers = () => {
        return getMockUsersDB();
    };

    // Derived values
    const userGroup = user ? getGroupById(user.user_metadata?.group_id || USER_GROUPS.LISTENER.id) : USER_GROUPS.GUEST;
    const isAdmin = userGroup.level >= USER_GROUPS.MODERATOR.level; // Moderator and up is "admin-like"

    return (
        <AuthContext.Provider value={{
            user,
            userGroup,
            isAdmin,
            login,
            register,
            logout,
            loginGoogle,
            loading,
            updateUserGroup,
            getAllUsers
        }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to access the current authentication state and actions.
 * @returns {Object} Authentication context value including user, groups, login/logout, etc.
 */
export const useAuth = () => useContext(AuthContext);
