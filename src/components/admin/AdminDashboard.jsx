import React, { useState } from 'react';
import './AdminDashboard.css';
import { Activity, Users, DollarSign, ShieldAlert, BarChart3, Settings, AlertTriangle, CheckCircle, Ban, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import TrueFocus from '../ui/TrueFocus';

import { useAuth } from '../../context/AuthContext';
import { USER_GROUPS, getGroupById } from '../../constants/groups';

/**
 * AdminDashboard Component - System overview and user management for administrators.
 * @returns {JSX.Element} The AdminDashboard component.
 */
const AdminDashboard = () => {
    const { theme } = useTheme();
    const { user, updateUserGroup, getAllUsers } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Hack to force refresh list

    // Get Mock Users
    const usersList = getAllUsers ? getAllUsers() : [];

    // Mock Data
    const stats = [
        { title: 'Total Users', value: '124,592', change: '+12%', icon: <Users size={20} />, color: 'text-blue-400' },
        { title: 'Monthly Revenue', value: '$45,290', change: '+8.5%', icon: <DollarSign size={20} />, color: 'text-green-400' },
        { title: 'Active Flags', value: '34', change: '-5', icon: <ShieldAlert size={20} />, color: 'text-red-400' },
        { title: 'Server Load', value: '42%', change: 'Stable', icon: <Activity size={20} />, color: 'text-purple-400' },
    ];

    const recentReports = [
        { id: 1, user: 'BadVibez99', reason: 'Hate Speech', status: 'Pending', time: '2m ago' },
        { id: 2, user: 'SpamBot_X', reason: 'Spamming', status: 'Banned', time: '15m ago' },
        { id: 3, user: 'TechnoKing', reason: 'Copyright', status: 'Resolved', time: '1h ago' },
    ];

    const handleGroupChange = (targetEmail, newGroupId) => {
        if (updateUserGroup(targetEmail, newGroupId)) {
            setRefreshTrigger(prev => prev + 1); // Refresh list
        } else {
            alert("Failed to update user group");
        }
    };

    return (
        <div className="admin-dashboard-container animate-fade p-6 max-w-[1400px] mx-auto text-white">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="glitch-font text-4xl mb-2">Command Center</h1>
                    <p className="text-gray-400 font-mono text-sm">System Status: <span className="text-green-400">ONLINE</span> • VibeOS v2.4.0 • Logged in as: {user?.email}</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-cyan-500 text-white' : 'glass text-gray-400 hover:text-white'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-cyan-500 text-white' : 'glass text-gray-400 hover:text-white'}`}
                    >
                        User Management
                    </button>
                </div>
            </header>

            {activeTab === 'overview' && (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="stat-card glass p-6 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
                                <div className={`absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
                                <div className="flex items-end gap-3">
                                    <span className="text-3xl font-bold font-mono">{stat.value}</span>
                                    <span className={`text-xs mb-1 ${stat.change.includes('+') ? 'text-green-400' : stat.change.includes('-') ? 'text-red-400' : 'text-gray-500'}`}>
                                        {stat.change}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Panel */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Traffic Chart Placeholder */}
                            <div className="glass p-6 min-h-[300px] flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold flex items-center gap-2"><BarChart3 size={18} className="text-cyan-400" /> Network Traffic</h3>
                                    <select className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-gray-300 outline-none">
                                        <option>Last 24 Hours</option>
                                        <option>Last 7 Days</option>
                                    </select>
                                </div>
                                <div className="flex-1 flex items-end justify-between gap-2 px-4 pb-2 border-b border-white/5">
                                    {/* Mock Bars */}
                                    {[40, 60, 35, 80, 55, 70, 45, 90, 65, 50, 75, 60, 85, 95, 40, 55, 70, 50, 60, 75].map((h, i) => (
                                        <div key={i} style={{ height: `${h}%` }} className="w-full bg-cyan-500/20 hover:bg-cyan-400 transition-colors rounded-t-sm relative group">
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-black px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{h}% Load</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-gray-600 font-mono">
                                    <span>00:00</span>
                                    <span>12:00</span>
                                    <span>23:59</span>
                                </div>
                            </div>

                            {/* Recent Moderation */}
                            <div className="glass p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold flex items-center gap-2"><ShieldAlert size={18} className="text-red-400" /> Recent Flags</h3>
                                    <button className="text-xs text-cyan-400 hover:text-white transition-colors">View All</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-500 uppercase border-b border-white/10">
                                            <tr>
                                                <th className="pb-3 pl-2">User</th>
                                                <th className="pb-3">Reason</th>
                                                <th className="pb-3">Time</th>
                                                <th className="pb-3">Status</th>
                                                <th className="pb-3 text-right pr-2">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {recentReports.map(report => (
                                                <tr key={report.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="py-3 pl-2 font-medium">{report.user}</td>
                                                    <td className="py-3 text-gray-400">{report.reason}</td>
                                                    <td className="py-3 text-gray-500 font-mono">{report.time}</td>
                                                    <td className="py-3">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${report.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400' :
                                                            report.status === 'Banned' ? 'bg-red-500/10 text-red-400' :
                                                                'bg-green-500/10 text-green-400'
                                                            }`}>
                                                            {report.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-right pr-2">
                                                        <button className="p-1 hover:bg-white/10 rounded ml-1 transition-colors"><Search size={14} /></button>
                                                        <button className="p-1 hover:bg-red-500/20 text-red-400 rounded ml-1 transition-colors"><Ban size={14} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar / Quick Actions */}
                        <div className="space-y-6">
                            <div className="glass p-6">
                                <h3 className="font-bold mb-4 flex items-center gap-2"><Settings size={18} /> Quick Actions</h3>
                                <div className="space-y-3">
                                    <button className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between group">
                                        <span className="text-sm">Broadcast Alert</span>
                                        <AlertTriangle size={16} className="text-yellow-400 group-hover:scale-110 transition-transform" />
                                    </button>
                                    <button className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between group">
                                        <span className="text-sm">Verify Requests</span>
                                        <CheckCircle size={16} className="text-green-400 group-hover:scale-110 transition-transform" />
                                    </button>
                                    <button className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between group">
                                        <span className="text-sm">Maintenance Mode</span>
                                        <Settings size={16} className="text-gray-400 group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            <div className="glass p-6 bg-gradient-to-br from-red-900/10 to-transparent border-red-500/10">
                                <h3 className="font-bold mb-2 text-red-400 uppercase tracking-wider text-xs">Security Alert</h3>
                                <p className="text-xs text-gray-400 mb-4">Unusual login attempts detected from IP range 192.168.x.x provided by VPN services.</p>
                                <button className="w-full py-2 bg-red-500/20 text-red-400 text-xs font-bold rounded border border-red-500/30 hover:bg-red-500 hover:text-white transition-all">
                                    Investigate
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'users' && (
                <div className="glass p-6 animate-fade">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Users className="text-cyan-400" />
                        Registered Users Management
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-gray-400 text-sm">
                                    <th className="p-4">Username</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Current Role</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersList.length === 0 ? (
                                    <tr><td colSpan="4" className="p-8 text-center text-gray-500">No users found in Mock DB. Try registering some users!</td></tr>
                                ) : (
                                    usersList.map((u, i) => (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-bold">{u.user_metadata?.username || 'Unknown'}</td>
                                            <td className="p-4 font-mono text-sm text-gray-400">{u.email}</td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-1">
                                                    <span
                                                        className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border w-fit"
                                                        style={{
                                                            backgroundColor: `${getGroupById(u.user_metadata?.group_id || 'listener').color}20`,
                                                            color: getGroupById(u.user_metadata?.group_id || 'listener').color,
                                                            borderColor: `${getGroupById(u.user_metadata?.group_id || 'listener').color}40`
                                                        }}
                                                    >
                                                        {getGroupById(u.user_metadata?.group_id || 'listener').name}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 font-mono">Legacy Role: {u.user_metadata?.role || 'user'}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <select
                                                    className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-gray-300 outline-none focus:border-cyan-500 transition-colors"
                                                    value={u.user_metadata?.group_id || 'listener'}
                                                    onChange={(e) => handleGroupChange(u.email, e.target.value)}
                                                    disabled={u.email === 'admin@vibe.music'}
                                                >
                                                    {Object.values(USER_GROUPS).map(group => (
                                                        <option key={group.id} value={group.id}>{group.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
