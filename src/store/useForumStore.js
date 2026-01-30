import { create } from 'zustand';

const MOCK_THREADS = [
    {
        id: 1,
        forumId: 1,
        title: 'Vibe 2.0 Update',
        author: 'Admin',
        authorId: 'admin-1',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        views: 245,
        replies: 12,
        isPinned: true,
        isLocked: false,
        lastReply: {
            author: 'VibeMaster',
            time: '1h ago'
        }
    },
    {
        id: 2,
        forumId: 2,
        title: 'Hello world',
        author: 'NewUser123',
        authorId: 'user-123',
        createdAt: new Date(Date.now() - 120000).toISOString(),
        views: 45,
        replies: 3,
        isPinned: false,
        isLocked: false,
        lastReply: {
            author: 'WelcomeBot',
            time: '2m ago'
        }
    }
];

const MOCK_POSTS = {
    1: [
        {
            id: 1,
            threadId: 1,
            author: 'Admin',
            authorId: 'admin-1',
            content: 'Excited to announce Vibe 2.0 with new features including real-time collaboration, enhanced audio processing, and much more!',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            likes: 24,
            isEdited: false
        },
        {
            id: 2,
            threadId: 1,
            author: 'VibeMaster',
            authorId: 'user-456',
            content: 'This is amazing! Can\'t wait to try the new features.',
            createdAt: new Date(Date.now() - 3500000).toISOString(),
            likes: 8,
            isEdited: false
        }
    ],
    2: [
        {
            id: 3,
            threadId: 2,
            author: 'NewUser123',
            authorId: 'user-123',
            content: 'Hey everyone! Just joined Vibe Music. Looking forward to connecting with fellow music creators!',
            createdAt: new Date(Date.now() - 120000).toISOString(),
            likes: 5,
            isEdited: false
        }
    ]
};

export const useForumStore = create((set, get) => ({
    // State
    threads: MOCK_THREADS,
    posts: MOCK_POSTS,
    activeThread: null,
    activeForum: null,
    isLoading: false,
    error: null,

    // Actions
    setActiveForum: (forumId) => set({ activeForum: forumId }),

    setActiveThread: (threadId) => set({ activeThread: threadId }),

    getThreadsByForum: (forumId) => {
        const { threads } = get();
        return threads.filter(t => t.forumId === forumId);
    },

    getPostsByThread: (threadId) => {
        const { posts } = get();
        return posts[threadId] || [];
    },

    createThread: (forumId, title, content, author) => {
        const newThread = {
            id: Date.now(),
            forumId,
            title,
            author: author.name,
            authorId: author.id,
            createdAt: new Date().toISOString(),
            views: 0,
            replies: 0,
            isPinned: false,
            isLocked: false,
            lastReply: null
        };

        const firstPost = {
            id: Date.now() + 1,
            threadId: newThread.id,
            author: author.name,
            authorId: author.id,
            content,
            createdAt: new Date().toISOString(),
            likes: 0,
            isEdited: false
        };

        set(state => ({
            threads: [...state.threads, newThread],
            posts: {
                ...state.posts,
                [newThread.id]: [firstPost]
            }
        }));

        return newThread.id;
    },

    createPost: (threadId, content, author) => {
        const newPost = {
            id: Date.now(),
            threadId,
            author: author.name,
            authorId: author.id,
            content,
            createdAt: new Date().toISOString(),
            likes: 0,
            isEdited: false
        };

        set(state => {
            const threadPosts = state.posts[threadId] || [];
            return {
                posts: {
                    ...state.posts,
                    [threadId]: [...threadPosts, newPost]
                },
                threads: state.threads.map(t =>
                    t.id === threadId
                        ? {
                            ...t,
                            replies: t.replies + 1,
                            lastReply: {
                                author: author.name,
                                time: 'Just now'
                            }
                        }
                        : t
                )
            };
        });

        return newPost.id;
    },

    likePost: (postId, threadId) => {
        set(state => ({
            posts: {
                ...state.posts,
                [threadId]: state.posts[threadId].map(p =>
                    p.id === postId ? { ...p, likes: p.likes + 1 } : p
                )
            }
        }));
    },

    incrementThreadViews: (threadId) => {
        set(state => ({
            threads: state.threads.map(t =>
                t.id === threadId ? { ...t, views: t.views + 1 } : t
            )
        }));
    },

    deletePost: (postId, threadId) => {
        set(state => ({
            posts: {
                ...state.posts,
                [threadId]: state.posts[threadId].filter(p => p.id !== postId)
            }
        }));
    },

    editPost: (postId, threadId, newContent) => {
        set(state => ({
            posts: {
                ...state.posts,
                [threadId]: state.posts[threadId].map(p =>
                    p.id === postId
                        ? { ...p, content: newContent, isEdited: true }
                        : p
                )
            }
        }));
    },

    clearError: () => set({ error: null })
}));
