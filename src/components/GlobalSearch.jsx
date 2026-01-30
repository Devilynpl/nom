import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import './GlobalSearch.css';

const MOCK_DATA = {
    tracks: [
        { id: 1, title: 'Cybernetic Soul', artist: 'Alex Vibe', type: 'track' },
        { id: 2, title: 'Obsidian Pulse', artist: 'Alex Vibe', type: 'track' },
        { id: 3, title: 'Neon Dreams', artist: 'DJ Vortex', type: 'track' },
    ],
    users: [
        { id: 1, name: 'Alex Vibe', type: 'user' },
        { id: 2, name: 'DJ Vortex', type: 'user' },
        { id: 3, name: 'DrillKing', type: 'user' },
    ],
    forums: [
        { id: 1, title: 'Best DAW for 2026?', category: 'Production', type: 'forum' },
        { id: 2, title: 'Collab on a drill track', category: 'Collaboration', type: 'forum' },
    ]
};

const GlobalSearch = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        // Fuzzy search
        const lowerQuery = query.toLowerCase();
        const allResults = [
            ...MOCK_DATA.tracks.filter(t =>
                t.title.toLowerCase().includes(lowerQuery) ||
                t.artist.toLowerCase().includes(lowerQuery)
            ),
            ...MOCK_DATA.users.filter(u =>
                u.name.toLowerCase().includes(lowerQuery)
            ),
            ...MOCK_DATA.forums.filter(f =>
                f.title.toLowerCase().includes(lowerQuery)
            )
        ];

        setResults(allResults.slice(0, 8)); // Limit to 8 results
    }, [query]);

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="search-overlay" onClick={onClose}>
            <div className="search-modal glass" onClick={(e) => e.stopPropagation()}>
                <div className="search-header">
                    <Search size={20} className="search-icon" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search tracks, users, forums..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="search-input"
                    />
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {results.length > 0 && (
                    <div className="search-results">
                        {results.map((result, idx) => (
                            <div key={`${result.type}-${result.id}`} className="search-result-item">
                                <div className="result-type-badge">{result.type}</div>
                                <div className="result-content">
                                    {result.type === 'track' && (
                                        <>
                                            <div className="result-title">{result.title}</div>
                                            <div className="result-subtitle">{result.artist}</div>
                                        </>
                                    )}
                                    {result.type === 'user' && (
                                        <div className="result-title">{result.name}</div>
                                    )}
                                    {result.type === 'forum' && (
                                        <>
                                            <div className="result-title">{result.title}</div>
                                            <div className="result-subtitle">{result.category}</div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {query && results.length === 0 && (
                    <div className="no-results">No results found for "{query}"</div>
                )}

                <div className="search-footer">
                    <span className="shortcut-hint">
                        <kbd>ESC</kbd> to close
                    </span>
                </div>
            </div>
        </div>
    );
};

export default GlobalSearch;
