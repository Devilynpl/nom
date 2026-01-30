import React, { useState } from 'react';
import './LyricAssistant.css';
import { Mic, Sparkles, Copy, RefreshCw } from 'lucide-react';

const LyricAssistant = () => {
    const [keyword, setKeyword] = useState('');
    const [mode, setMode] = useState('rhyme'); // 'rhyme' or 'metaphor'
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        if (!keyword) return;
        setLoading(true);
        try {
            const res = await fetch('/api/tools/lyrics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: mode, keyword })
            });
            const data = await res.json();
            setResults(data.results);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    return (
        <div className="lyric-container animate-fade">
            <div className="tool-header">
                <div className="icon-wrapper">
                    <Sparkles size={32} className="accent-cyan" />
                </div>
                <h1>AI Lyric Assistant</h1>
                <p>Break writer's block with neural rhymes and deep metaphors.</p>
            </div>

            <div className="tool-interface glass">
                <div className="input-area">
                    <input
                        type="text"
                        placeholder="Enter a word (e.g. 'Love', 'Time')..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && generate()}
                    />
                    <div className="mode-toggle">
                        <button
                            className={mode === 'rhyme' ? 'active' : ''}
                            onClick={() => setMode('rhyme')}
                        >
                            Rhymes
                        </button>
                        <button
                            className={mode === 'metaphor' ? 'active' : ''}
                            onClick={() => setMode('metaphor')}
                        >
                            Metaphors
                        </button>
                    </div>
                    <button className="generate-btn" onClick={generate} disabled={loading}>
                        {loading ? <RefreshCw className="spin" /> : 'Inspire Me'}
                    </button>
                </div>

                <div className="results-area">
                    {results.length > 0 ? (
                        <div className="tags-cloud">
                            {results.map((item, i) => (
                                <span key={i} className="result-tag animate-pop" onClick={() => navigator.clipboard.writeText(item)}>
                                    {item}
                                    <Copy size={12} className="copy-icon" />
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <Mic size={48} />
                            <span>Enter a keyword to start generating.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LyricAssistant;
