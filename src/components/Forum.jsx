import React, { useState, useEffect } from 'react';
import { MessageSquare, User, Clock, FileText, Hash, ArrowLeft, Send, ThumbsUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useForumStore } from '../store/useForumStore';
import './Forum.css';

const MOCK_FORUMS = [
    {
        id: 'cat-main',
        title: 'General Discussions',
        forums: [
            { id: 1, title: 'Announcements', description: 'Official updates from the Vibe Team.', topics: 45, posts: 320, lastPost: { user: 'Admin', time: '1h ago', topic: 'Vibe 2.0 Update' } },
            { id: 2, title: 'Introductions', description: 'New here? Say hello!', topics: 1205, posts: 5400, lastPost: { user: 'NewUser123', time: '2m ago', topic: 'Hello world' } },
            { id: 3, title: 'General Chat', description: 'Talk about anything and everything.', topics: 340, posts: 1200, lastPost: { user: 'VibeMaster', time: '5m ago', topic: 'Weekend plans?' } }
        ]
    },
    {
        id: 'cat-prod',
        title: 'Music Production',
        forums: [
            { id: 4, title: 'DAW Talk', description: 'Ableton, FL Studio, Logic, etc.', topics: 89, posts: 410, lastPost: { user: 'BeatMaker', time: '1d ago', topic: 'FL 21 vs Ableton 12' } },
            { id: 5, title: 'Sound Design', description: 'Synthesis, sampling, and creating textures.', topics: 56, posts: 230, lastPost: { user: 'SynthGod', time: '4h ago', topic: 'How to make this bass?' } },
            { id: 6, title: 'Track Feedback', description: 'Post your WIPs for community review.', topics: 210, posts: 890, lastPost: { user: 'WIP_Guy', time: '10m ago', topic: 'Need mix advice' } }
        ]
    },
    {
        id: 'cat-market',
        title: 'Marketplace',
        forums: [
            { id: 7, title: 'Collab Requests', description: 'Find people to work with.', topics: 34, posts: 120, lastPost: { user: 'SingerOne', time: '30m ago', topic: 'Looking for producer' } },
            { id: 8, title: 'Buy/Sell Gear', description: 'Hardware and Software trading.', topics: 12, posts: 45, lastPost: { user: 'GearHead', time: '2d ago', topic: 'Selling Korg Minilogue' } }
        ]
    }
];

const Forum = () => {
    const { user } = useAuth();
    const [view, setView] = useState('index'); // 'index', 'forum', 'thread'
    const [newThreadTitle, setNewThreadTitle] = useState('');
    const [newThreadContent, setNewThreadContent] = useState('');
    const [newPostContent, setNewPostContent] = useState('');

    const {
        threads,
        posts,
        activeForum,
        activeThread,
        setActiveForum,
        setActiveThread,
        getThreadsByForum,
        getPostsByThread,
        createThread,
        createPost,
        likePost,
        incrementThreadViews
    } = useForumStore();

    const handleForumClick = (forum) => {
        setActiveForum(forum.id);
        setView('forum');
    };

    const handleThreadClick = (thread) => {
        setActiveThread(thread.id);
        incrementThreadViews(thread.id);
        setView('thread');
    };

    const handleCreateThread = () => {
        if (!newThreadTitle.trim() || !newThreadContent.trim()) return;

        const threadId = createThread(
            activeForum,
            newThreadTitle,
            newThreadContent,
            user || { id: 'guest', name: 'Guest User' }
        );

        setNewThreadTitle('');
        setNewThreadContent('');
        handleThreadClick({ id: threadId });
    };

    const handleCreatePost = () => {
        if (!newPostContent.trim()) return;

        createPost(
            activeThread,
            newPostContent,
            user || { id: 'guest', name: 'Guest User' }
        );

        setNewPostContent('');
    };

    const currentForum = MOCK_FORUMS.flatMap(c => c.forums).find(f => f.id === activeForum);
    const currentThreads = getThreadsByForum(activeForum);
    const currentThread = threads.find(t => t.id === activeThread);
    const currentPosts = getPostsByThread(activeThread);

    return (
        <div className="vibebb-container animate-fade">
            {/* Header / Breadcrumbs */}
            <div className="vibebb-header">
                <div className="logo-area">
                    <h1 className="text-2xl font-black italic tracking-tighter text-cyan-400">Vibe<span className="text-white">BB</span></h1>
                    <p className="text-xs text-white/50">The Community Board</p>
                </div>
                <div className="bb-stats text-xs text-white/40 flex gap-4">
                    <span>Current time: {new Date().toLocaleTimeString()}</span>
                    <span>Last visit: Today</span>
                </div>
            </div>

            {/* Navbar */}
            <div className="vibebb-nav">
                <button
                    className={`nav-item ${view === 'index' ? 'active' : ''}`}
                    onClick={() => setView('index')}
                >
                    Board Index
                </button>
                <button className="nav-item">FAQ</button>
                <button className="nav-item">Search</button>
                <button className="nav-item">User Control Panel</button>
                {user && <button className="nav-item ml-auto">Logout [ {user.name} ]</button>}
            </div>

            {/* Board Index View */}
            {view === 'index' && (
                <div className="board-index">
                    {MOCK_FORUMS.map(category => (
                        <div key={category.id} className="forum-category">
                            <div className="category-header">
                                <div className="cat-name">{category.title}</div>
                                <div className="cat-stat-header">Topics</div>
                                <div className="cat-stat-header">Posts</div>
                                <div className="cat-stat-header">Last Post</div>
                            </div>
                            <div className="category-body">
                                {category.forums.map(forum => (
                                    <div key={forum.id} className="forum-row" onClick={() => handleForumClick(forum)}>
                                        <div className="forum-icon">
                                            <MessageSquare size={24} className="text-cyan-400" />
                                        </div>
                                        <div className="forum-info">
                                            <h3 className="forum-title">{forum.title}</h3>
                                            <p className="forum-desc">{forum.description}</p>
                                        </div>
                                        <div className="forum-stat">{forum.topics}</div>
                                        <div className="forum-stat">{forum.posts}</div>
                                        <div className="forum-lastpost">
                                            <div className="text-cyan-400 text-xs truncate max-w-[120px]">{forum.lastPost.topic}</div>
                                            <div className="text-white/40 text-[10px]">by {forum.lastPost.user}</div>
                                            <div className="text-white/40 text-[10px]">{forum.lastPost.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Forum View (Thread List) */}
            {view === 'forum' && currentForum && (
                <div className="forum-view p-4">
                    <button
                        onClick={() => setView('index')}
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4 text-sm"
                    >
                        <ArrowLeft size={16} /> Back to Board Index
                    </button>

                    <h2 className="text-xl font-bold text-white mb-2">{currentForum.title}</h2>
                    <p className="text-sm text-white/60 mb-6">{currentForum.description}</p>

                    {/* New Thread Form */}
                    <div className="bg-white/5 rounded-lg p-4 mb-6">
                        <h3 className="text-sm font-bold text-white mb-3">Start New Thread</h3>
                        <input
                            type="text"
                            placeholder="Thread Title"
                            value={newThreadTitle}
                            onChange={(e) => setNewThreadTitle(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm mb-2"
                        />
                        <textarea
                            placeholder="Your message..."
                            value={newThreadContent}
                            onChange={(e) => setNewThreadContent(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm mb-2 h-24"
                        />
                        <button
                            onClick={handleCreateThread}
                            className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded text-sm font-bold"
                        >
                            Post Thread
                        </button>
                    </div>

                    {/* Thread List */}
                    <div className="space-y-2">
                        {currentThreads.map(thread => (
                            <div
                                key={thread.id}
                                onClick={() => handleThreadClick(thread)}
                                className="bg-white/5 hover:bg-white/10 rounded-lg p-4 cursor-pointer transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="text-white font-medium mb-1">{thread.title}</h4>
                                        <p className="text-xs text-white/40">
                                            by {thread.author} • {new Date(thread.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-right text-xs text-white/40">
                                        <div>{thread.views} views</div>
                                        <div>{thread.replies} replies</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Thread View (Posts) */}
            {view === 'thread' && currentThread && (
                <div className="thread-view p-4">
                    <button
                        onClick={() => setView('forum')}
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4 text-sm"
                    >
                        <ArrowLeft size={16} /> Back to {currentForum?.title}
                    </button>

                    <h2 className="text-xl font-bold text-white mb-6">{currentThread.title}</h2>

                    {/* Posts */}
                    <div className="space-y-4 mb-6">
                        {currentPosts.map(post => (
                            <div key={post.id} className="bg-white/5 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                                        <User size={20} className="text-cyan-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-white font-medium text-sm">{post.author}</span>
                                            <span className="text-white/40 text-xs">
                                                {new Date(post.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-white/80 text-sm mb-3">{post.content}</p>
                                        <button
                                            onClick={() => likePost(post.id, currentThread.id)}
                                            className="flex items-center gap-1 text-white/40 hover:text-cyan-400 text-xs"
                                        >
                                            <ThumbsUp size={14} />
                                            <span>{post.likes}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Reply Form */}
                    <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-bold text-white mb-3">Post Reply</h3>
                        <textarea
                            placeholder="Your reply..."
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm mb-2 h-24"
                        />
                        <button
                            onClick={handleCreatePost}
                            className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded text-sm font-bold flex items-center gap-2"
                        >
                            <Send size={14} /> Post Reply
                        </button>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="vibebb-footer">
                <div className="online-stats">
                    <h4 className="text-xs font-bold text-white mb-1">Who is online</h4>
                    <p className="text-[10px] text-white/40">In total there are <strong>142</strong> users online :: 12 registered, 0 hidden and 130 guests</p>
                </div>
                <div className="copyright text-[10px] text-white/20 mt-4 text-center">
                    Powered by VibeBB © 2026 Vibe Music Group
                </div>
            </div>
        </div>
    );
};

export default Forum;
