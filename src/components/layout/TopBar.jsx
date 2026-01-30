import React from 'react';
import GlobalSearch from '../GlobalSearch';
import { Bell, User, Settings, LogOut, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const TopBar = ({ activePage, user, onSearchClick }) => {
    const { logout } = useAuth();
    // In a real app, we'd get notification count// Verified content
    const notificationCount = 0;

    return (
        <div className="h-16 border-b border-[var(--glass-border)] flex items-center justify-between pl-[124px] pr-6 bg-[var(--bg-deep)]/80 backdrop-blur-md sticky top-0 z-40">
            {/* Left: Breadcrumbs or Page Title */}
            <div className="flex items-center gap-4">
                <h2 className="text-xl capitalize text-white">{activePage.replace('-', ' ')}</h2>
            </div>

            {/* Center: Search Trigger (if global search isn't always open) */}
            <div
                className="flex-1 max-w-xl mx-8 relative group cursor-pointer"
                onClick={onSearchClick}
            >
                <div className="w-full bg-[var(--bg-panel)] border border-[var(--glass-border)] rounded-full py-2 px-4 flex items-center text-[var(--text-muted)] group-hover:border-[var(--primary)] transition-colors">
                    <Search size={16} className="mr-3" />
                    <span className="text-sm">Search tracks, artists, vibes... (Cmd+K)</span>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                <button className="relative p-2 text-[var(--text-muted)] hover:text-white transition-colors">
                    <Bell size={20} />
                    {notificationCount > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                </button>

                <div className="h-8 w-[1px] bg-[var(--glass-border)] mx-2"></div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <div className="flex flex-col items-end mr-3">
                            <span className="font-bold text-white text-sm">{user?.username || user?.name}</span>
                            <div className="flex gap-3 text-xs">
                                <span className="text-gray-400 flex items-center gap-1" title="Silver Vibes (Common)">
                                    ⚪ {user?.silverCoins || 0}
                                </span>
                                <span className="text-yellow-400 flex items-center gap-1 font-bold" title="Golden Vibez (Premium)">
                                    🟡 {user?.goldenCoins || 0}
                                </span>
                            </div>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--primary)] to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                            {user?.avatar_url ? (
                                <img src={user.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                (user?.username?.[0] || 'U').toUpperCase()
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
