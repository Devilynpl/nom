import React from 'react';
import './Sidebar.css';
import { Home, Users, User, Share2, Music, ShoppingBag, Globe, Crown, MessageSquare, Sun, Moon, Trophy, Boxes, ChevronLeft, PlusCircle, Shield, LogOut, Video } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

import { useAuth } from '../context/AuthContext'; // Import useAuth

/**
 * Sidebar Component - Main navigation and user profile status.
 * @param {Object} props - Component props.
 * @param {string} props.activePage - Currently active page ID.
 * @param {Function} props.setActivePage - Function to switch active page.
 * @param {Function} props.onToggle - Function to toggle sidebar collapse state.
 * @param {boolean} props.isCollapsed - Whether the sidebar is currently collapsed.
 * @returns {JSX.Element} The Sidebar component.
 */
const Sidebar = ({ activePage, setActivePage, onToggle, isCollapsed }) => {
    const { t, language, toggleLanguage } = useLanguage();
    const { user, userGroup, isAdmin, logout } = useAuth(); // Get user details from context

    const menuItems = [
        { name: t('home'), icon: <Home size={24} />, id: 'home' },
        { name: t('create'), icon: <PlusCircle size={24} />, id: 'create' }, // Added here as requested
        { name: t('explore'), icon: <Globe size={24} />, id: 'explore' },
        { name: t('world'), icon: <Boxes size={24} />, id: 'world' },
        { name: t('community'), icon: <Users size={24} />, id: 'community' },
        { name: t('forum'), icon: <MessageSquare size={24} />, id: 'forum' },
        { name: t('profile'), icon: <User size={24} />, id: 'profile' },
        { name: t('shop'), icon: <ShoppingBag size={24} />, id: 'shop' },
        { name: t('premium'), icon: <Crown size={24} />, id: 'premium' },
        { name: t('vinylGoal'), icon: <Trophy size={24} />, id: 'road-to-vinyl' },
        { name: 'VibeMontage', icon: <Video size={24} />, id: 'vibe-montage' },
        { name: t('library'), icon: <Music size={24} />, id: 'library' },
    ];

    // Use the exported isAdmin logic from AuthContext
    if (isAdmin) {
        menuItems.push({ name: 'Admin', icon: <Shield size={24} />, id: 'admin-dashboard' });
    }

    const { theme, toggleTheme, effectsEnabled, toggleEffects } = useTheme();

    return (
        <div className="sidebar-container glass h-full w-full flex flex-col relative">
            {onToggle && (
                <button
                    onClick={onToggle}
                    className="absolute top-10 -right-3 z-50 p-1.5 bg-black/80 hover:bg-cyan-500/20 backdrop-blur-md rounded-full transition-all text-cyan-400 hover:text-white border border-white/10 shadow-lg"
                    title="Toggle Sidebar"
                >
                    <ChevronLeft size={16} />
                </button>
            )}
            <div className="logo relative w-full py-6 px-4 mb-2 border-b border-white/5 flex items-center justify-center">
                <img
                    src="/logo2-light.png"
                    alt="Vibe Music Logo"
                    className="vibe-logo-img"
                />
            </div>

            <nav className="nav-menu px-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                        onClick={() => setActivePage(item.id)}
                    >
                        <span className="icon">{item.icon}</span>
                        <span className="label">{item.name}</span>
                    </button>
                ))}
            </nav>
            <div className="sidebar-footer p-4">
                <div className="switches-container !border-none !bg-transparent !p-0 mb-6 flex-col gap-6">
                    {/* Theme Toggle */}
                    <div className="switch-group">
                        <div className="switch-label">{t('mode')} / Theme</div>
                        <label id="theme-toggle-button">
                            <input
                                type="checkbox"
                                id="toggle"
                                checked={theme === 'dark'}
                                onChange={toggleTheme}
                            />
                            <svg viewBox="0 0 69.66666666666667 36.666666666666664" style={{ width: '100%', height: '100%' }}>
                                <defs>
                                    <clipPath id="clip-path">
                                        <rect width="69.667" height="36.667" rx="18.333" fill="none"></rect>
                                    </clipPath>
                                    <filter id="shadow-1" x="-20%" y="-20%" width="140%" height="140%">
                                        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.2)" />
                                    </filter>
                                </defs>
                                <g id="window">
                                    <rect id="container" width="69.667" height="36.667" rx="18.333" fill="#83cbd8" stroke="#999" strokeWidth="0"></rect>
                                    <g id="stars" opacity="0">
                                        <path fill="#FFF" d="M21.9,11.3l0.8-0.8l0.8,0.8l-0.8,0.8L21.9,11.3z M48.7,16.5l-0.8,0.8l0.8,0.8l0.8-0.8L48.7,16.5z M40.7,28.7l-0.8,0.8l0.8,0.8l0.8-0.8L40.7,28.7z" />
                                    </g>
                                    <g id="cloud">
                                        <path fill="#FFFFFF" d="M49.3,17.2c-0.6-2.9-3.2-5.1-6.4-5.1c-3.1,0-5.7,2.1-6.3,4.9c-0.2,0-0.4,0-0.6,0c-3.2,0-5.8,2.6-5.8,5.8c0,3.2,2.6,5.8,5.8,5.8h13.3c2.7,0,4.8-2.2,4.8-4.8C54.1,20.4,52,18.1,49.3,17.2z" />
                                    </g>
                                    <g id="button" transform="translate(2.333, 2.333)" filter="url(#shadow-1)">
                                        <circle cx="16" cy="16" r="14" fill="#F8E71C" />
                                        <g id="sun">
                                            <circle cx="16" cy="16" r="12" fill="#F5A623" opacity="0.2" />
                                        </g>
                                        <g id="moon" opacity="0">
                                            <circle cx="16" cy="16" r="14" fill="#C8D4D7" />
                                            <circle cx="22" cy="12" r="3" fill="#9AA4A8" opacity="0.6" />
                                            <circle cx="11" cy="18" r="4" fill="#9AA4A8" opacity="0.6" />
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </label>
                    </div>

                    <div className="controls-row items-center justify-between">
                        {/* Language Toggle */}
                        <div className="switch-group !w-auto">
                            <div className="switch-label">Lang</div>
                            <label className="switch" id="switch-lang">
                                <input
                                    type="checkbox"
                                    className="input"
                                    checked={language === 'en'}
                                    onChange={toggleLanguage}
                                />
                                <span className="slider">
                                    <div className="icon-slot slot-left flag-icon">
                                        <svg viewBox="0 0 60 30" width="20" height="10">
                                            <clipPath id="t-en">
                                                <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
                                            </clipPath>
                                            <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
                                            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                                            <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t-en)" stroke="#C8102E" strokeWidth="4" />
                                            <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
                                            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
                                        </svg>
                                    </div>
                                    <div className="icon-slot slot-right flag-icon">
                                        <svg viewBox="0 0 24 24" width="20" height="20">
                                            <rect width="24" height="12" fill="white" y="0" />
                                            <rect width="24" height="12" fill="#DC143C" y="12" />
                                        </svg>
                                    </div>
                                </span>
                            </label>
                        </div>

                        {/* Effects Toggle */}
                        <div className="switch-group !w-auto">
                            <div className="switch-label">FX</div>
                            <label className="switch" id="switch-fx">
                                <input
                                    type="checkbox"
                                    className="input"
                                    checked={effectsEnabled}
                                    onChange={toggleEffects}
                                />
                                <span className="slider">
                                    <div className="icon-slot slot-left">ON</div>
                                    <div className="icon-slot slot-right">OFF</div>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="user-profile whitespace-nowrap overflow-hidden flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 overflow-hidden flex-1">
                        <div className="avatar flex-shrink-0 bg-gradient-to-tr from-cyan-400 to-purple-500 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white">
                            {user?.user_metadata?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col min-w-0">
                                <span className="truncate font-medium text-sm">
                                    {user?.user_metadata?.username || user?.email?.split('@')[0] || t('userProfile')}
                                </span>
                                <span
                                    className="text-[10px] px-1.5 py-0.5 rounded-full w-fit font-bold uppercase tracking-wider"
                                    style={{
                                        backgroundColor: `${userGroup.color}20`,
                                        color: userGroup.color,
                                        border: `1px solid ${userGroup.color}40`
                                    }}
                                >
                                    {userGroup.name}
                                </span>
                            </div>
                        )}
                    </div>
                    {!isCollapsed && (
                        <button
                            onClick={logout}
                            className="p-1.5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                            title={t('signOut')}
                        >
                            <LogOut size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
