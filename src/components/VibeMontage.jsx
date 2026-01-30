import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Video, Settings, Wand2, Plus, Trash2, Save, Download, Play, Pause, Scissors, MoveRight, Layers } from 'lucide-react';

const NODE_TYPES = {
    CLIP: 'clip',
    TRANSITION: 'transition',
    EFFECT: 'effect'
};

const VibeMontage = () => {
    const [nodes, setNodes] = useState([
        { id: '1', type: NODE_TYPES.CLIP, data: { name: 'Clip 01', duration: 6, start: 0, end: 6, path: '' } }
    ]);
    const [selectedNodeId, setSelectedNodeId] = useState('1');

    const addNode = (type) => {
        const lastNode = nodes[nodes.length - 1];

        // Validation logic based on user rules
        if (type === NODE_TYPES.CLIP && lastNode?.type === NODE_TYPES.CLIP) {
            // Automatically insert transition if adding two clips sequentially
            const transitionId = Math.random().toString(36).substr(2, 9);
            const clipId = Math.random().toString(36).substr(2, 9);
            setNodes([...nodes,
            { id: transitionId, type: NODE_TYPES.TRANSITION, data: { type: 'fade', duration: 1 } },
            { id: clipId, type: NODE_TYPES.CLIP, data: { name: `Clip ${nodes.filter(n => n.type === NODE_TYPES.CLIP).length + 1}`, duration: 6, start: 0, end: 6, path: '' } }
            ]);
            setSelectedNodeId(clipId);
            return;
        }

        const id = Math.random().toString(36).substr(2, 9);
        const newNode = {
            id,
            type,
            data: type === NODE_TYPES.CLIP
                ? { name: `Clip ${nodes.filter(n => n.type === NODE_TYPES.CLIP).length + 1}`, duration: 6, start: 0, end: 6, path: '' }
                : type === NODE_TYPES.TRANSITION
                    ? { type: 'fade', duration: 1 }
                    : { type: 'blur', intensity: 50 }
        };
        setNodes([...nodes, newNode]);
        setSelectedNodeId(id);
    };

    const removeNode = (id) => {
        setNodes(nodes.filter(n => n.id !== id));
        if (selectedNodeId === id) setSelectedNodeId(null);
    };

    const updateNodeData = (id, newData) => {
        setNodes(nodes.map(n => n.id === id ? { ...n, data: { ...n.data, ...newData } } : n));
    };

    const selectedNode = nodes.find(n => n.id === selectedNodeId);

    return (
        <div className="vibe-montage-container h-full flex flex-col gap-6 font-sans text-white">
            <header className="flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent tracking-tight">
                        VIBE_MONTAGE
                    </h1>
                    <p className="text-gray-400 text-sm font-mono mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        NODE_SEQUENCER_v1.0.4
                    </p>
                </motion.div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-medium backdrop-blur-xl">
                        <Save size={18} className="text-cyan-400" /> Save
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all text-sm font-bold shadow-lg shadow-cyan-500/20">
                        <Download size={18} /> Render
                    </button>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
                {/* Node Editor */}
                <div className="col-span-8 glass rounded-3xl p-8 relative overflow-hidden flex flex-col border border-white/10">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold flex items-center gap-3">
                            <div className="p-2 bg-cyan-500/20 rounded-lg">
                                <Layers size={20} className="text-cyan-400" />
                            </div>
                            Sequence Editor
                        </h2>
                        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-2xl">
                            <button
                                onClick={() => addNode(NODE_TYPES.CLIP)}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl transition-all text-sm font-semibold text-cyan-400"
                            >
                                <Plus size={16} /> Clip
                            </button>
                            <div className="w-[1px] bg-white/10 mx-1" />
                            <button
                                onClick={() => addNode(NODE_TYPES.TRANSITION)}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl transition-all text-sm font-semibold text-purple-400"
                            >
                                <Plus size={16} /> Transition
                            </button>
                            <div className="w-[1px] bg-white/10 mx-1" />
                            <button
                                onClick={() => addNode(NODE_TYPES.EFFECT)}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl transition-all text-sm font-semibold text-yellow-400"
                            >
                                <Plus size={16} /> Effect
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <Reorder.Group
                            axis="y"
                            values={nodes}
                            onReorder={setNodes}
                            className="flex flex-col items-center gap-12 py-10 relative"
                        >
                            {/* Connection Line */}
                            <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-blue-500/50 left-1/2 -translate-x-1/2 -z-10" />

                            <AnimatePresence mode="popLayout">
                                {nodes.map((node, index) => (
                                    <Reorder.Item
                                        key={node.id}
                                        value={node}
                                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                    >
                                        <NodeCard
                                            node={node}
                                            index={index}
                                            isSelected={selectedNodeId === node.id}
                                            onSelect={() => setSelectedNodeId(node.id)}
                                            onRemove={() => removeNode(node.id)}
                                        />
                                    </Reorder.Item>
                                ))}
                            </AnimatePresence>

                            {nodes.length === 0 && (
                                <div className="text-gray-500 text-center py-20 flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                                        <Plus className="text-gray-600" />
                                    </div>
                                    <p className="italic font-mono text-sm uppercase tracking-widest">Sequence is empty. Add a node to start.</p>
                                </div>
                            )}
                        </Reorder.Group>
                    </div>
                </div>

                {/* Preview & Params */}
                <div className="col-span-4 flex flex-col gap-6 h-full overflow-hidden">
                    <div className="glass rounded-3xl p-5 aspect-video relative overflow-hidden group border border-white/10 shadow-2xl">
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px]">
                            <button className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(6,182,212,0.6)] transform scale-90 group-hover:scale-100 transition-all">
                                <Play size={32} fill="currentColor" className="ml-1" />
                            </button>
                        </div>
                        <div className="w-full h-full bg-gradient-to-br from-black/40 to-black/20 rounded-2xl flex flex-col items-center justify-center border border-white/5">
                            <div className="relative">
                                <Video size={64} className="text-white/10" strokeWidth={1} />
                                <motion.div
                                    animate={{ height: ['0%', '100%', '0%'] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-x-0 top-0 bg-cyan-400/20 blur-xl -z-10"
                                />
                            </div>
                            <span className="text-[10px] mt-4 font-mono text-cyan-400/50 uppercase tracking-[0.3em]">Live Preview Engine</span>
                        </div>

                        {/* Playback Progress */}
                        <div className="absolute bottom-5 inset-x-5 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '45%' }}
                                className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,1)]"
                            />
                        </div>
                    </div>

                    <div className="flex-1 glass rounded-3xl p-8 flex flex-col gap-6 overflow-hidden border border-white/10">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 flex items-center gap-3">
                            <div className="w-4 h-4 rounded-sm border border-current opacity-50" />
                            Node Logic Inspector
                        </h3>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {selectedNode ? (
                                    <motion.div
                                        key={selectedNode.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex flex-col gap-6"
                                    >
                                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Node Header</div>
                                            <div className="flex items-center justify-between">
                                                <div className="font-bold text-lg">{selectedNode.data.name || selectedNode.type.toUpperCase()}</div>
                                                <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${selectedNode.type === NODE_TYPES.CLIP ? 'border-cyan-500/50 text-cyan-400 bg-cyan-400/10' :
                                                    selectedNode.type === NODE_TYPES.TRANSITION ? 'border-purple-500/50 text-purple-400 bg-purple-400/10' :
                                                        'border-yellow-500/50 text-yellow-400 bg-yellow-400/10'
                                                    }`}>
                                                    {selectedNode.type}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {selectedNode.type === NODE_TYPES.CLIP && (
                                                <>
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Time Range (0s - 6s)</label>
                                                        <div className="relative h-10 bg-black/40 rounded-xl border border-white/5 flex items-center px-4">
                                                            <input
                                                                type="range"
                                                                min="0"
                                                                max="6"
                                                                step="0.1"
                                                                value={selectedNode.data.end}
                                                                onChange={(e) => updateNodeData(selectedNode.id, { end: parseFloat(e.target.value) })}
                                                                className="w-full accent-cyan-500"
                                                            />
                                                        </div>
                                                        <div className="flex justify-between text-[10px] font-mono text-gray-500">
                                                            <span>START: {selectedNode.data.start.toFixed(1)}s</span>
                                                            <span>END: {selectedNode.data.end.toFixed(1)}s</span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Resource Path</label>
                                                        <input
                                                            type="text"
                                                            value={selectedNode.data.path}
                                                            onChange={(e) => updateNodeData(selectedNode.id, { path: e.target.value })}
                                                            placeholder="/assets/video/raw_01.mp4"
                                                            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-cyan-400 focus:outline-none focus:border-cyan-500/50 placeholder:text-gray-700"
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            {selectedNode.type === NODE_TYPES.TRANSITION && (
                                                <>
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Transition Type</label>
                                                        <select
                                                            value={selectedNode.data.type}
                                                            onChange={(e) => updateNodeData(selectedNode.id, { type: e.target.value })}
                                                            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-purple-500/50 appearance-none"
                                                        >
                                                            <option value="fade">Cross Fade</option>
                                                            <option value="wipe">Linear Wipe</option>
                                                            <option value="dissolve">Gaussian Dissolve</option>
                                                            <option value="glitch">Digital Glitch</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Duration ({selectedNode.data.duration}s)</label>
                                                        <input
                                                            type="range"
                                                            min="0.1"
                                                            max="2.0"
                                                            step="0.1"
                                                            value={selectedNode.data.duration}
                                                            onChange={(e) => updateNodeData(selectedNode.id, { duration: parseFloat(e.target.value) })}
                                                            className="w-full accent-purple-500"
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            {selectedNode.type === NODE_TYPES.EFFECT && (
                                                <>
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Selected FX</label>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {['Blur', 'Sepia', 'Invert', 'Vignette'].map(fx => (
                                                                <button
                                                                    key={fx}
                                                                    onClick={() => updateNodeData(selectedNode.id, { type: fx.toLowerCase() })}
                                                                    className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${selectedNode.data.type === fx.toLowerCase()
                                                                        ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                                                                        : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'
                                                                        }`}
                                                                >
                                                                    {fx}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Intensity ({selectedNode.data.intensity}%)</label>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="100"
                                                            value={selectedNode.data.intensity}
                                                            onChange={(e) => updateNodeData(selectedNode.id, { intensity: parseInt(e.target.value) })}
                                                            className="w-full accent-yellow-500"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-600 text-sm italic py-20 text-center gap-4">
                                        <div className="w-12 h-12 border-2 border-dashed border-white/10 rounded-full flex items-center justify-center">
                                            <Settings size={20} />
                                        </div>
                                        <p className="max-w-[200px]">Select a node in the sequence to configure orchestration logic</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NodeCard = ({ node, index, isSelected, onSelect, onRemove }) => {
    const iconMap = {
        [NODE_TYPES.CLIP]: <Video size={20} className="text-cyan-400" />,
        [NODE_TYPES.TRANSITION]: <MoveRight size={20} className="text-purple-400" />,
        [NODE_TYPES.EFFECT]: <Wand2 size={20} className="text-yellow-400" />
    };

    const colorMap = {
        [NODE_TYPES.CLIP]: 'cyan',
        [NODE_TYPES.TRANSITION]: 'purple',
        [NODE_TYPES.EFFECT]: 'yellow'
    };

    const color = colorMap[node.type];
    const glowColor = color === 'cyan' ? '6, 182, 212' : color === 'purple' ? '168, 85, 247' : '234, 179, 8';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                boxShadow: isSelected ? `0 0 50px rgba(${glowColor}, 0.2)` : '0 0 0px rgba(0,0,0,0)'
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={onSelect}
            className={`relative w-72 p-6 rounded-[2rem] border transition-all duration-500 group backdrop-blur-3xl ${isSelected
                ? `bg-white/[0.08] border-${color}-400/50`
                : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                }`}
        >
            {/* Animated Background Glow */}
            {isSelected && (
                <motion.div
                    className={`absolute inset-0 bg-${color}-500/10 rounded-[2rem] -z-10`}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
            )}

            <div className={`absolute -top-3 left-8 px-4 py-1.5 bg-[#0a0c12] border border-white/10 rounded-full text-[9px] font-mono text-gray-500 tracking-widest uppercase shadow-xl`}>
                ID_{node.id.slice(0, 4)}
            </div>

            <div className="flex items-center justify-between mb-5">
                <div className={`p-3 bg-${color}-500/10 rounded-2xl border border-${color}-500/20 shadow-inner`}>
                    {iconMap[node.type]}
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onRemove(); }}
                    className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-red-400 rounded-xl transition-all duration-300"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            <div className="space-y-3">
                <div className="font-black text-base tracking-tight leading-tight uppercase italic">{node.data.name || node.type}</div>
                <div className="flex flex-wrap gap-2">
                    {node.type === NODE_TYPES.CLIP && (
                        <>
                            <div className="flex gap-1.5 items-center bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 text-[10px] font-bold text-cyan-400">
                                <Scissors size={10} /> {node.data.end - node.data.start}s
                            </div>
                            <div className="flex gap-1.5 items-center bg-white/5 px-3 py-1 rounded-full border border-white/5 text-[10px] font-mono text-gray-400">
                                FPS: 30
                            </div>
                        </>
                    )}
                    {node.type === NODE_TYPES.TRANSITION && (
                        <div className="flex gap-1.5 items-center bg-purple-400/10 px-3 py-1 rounded-full border border-purple-400/20 text-[10px] font-bold text-purple-400 uppercase tracking-tighter">
                            <MoveRight size={10} /> {node.data.type}
                        </div>
                    )}
                    {node.type === NODE_TYPES.EFFECT && (
                        <div className="flex gap-1.5 items-center bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20 text-[10px] font-bold text-yellow-400 uppercase tracking-tighter">
                            <Wand2 size={10} /> {node.data.type} @ {node.data.intensity}%
                        </div>
                    )}
                </div>
            </div>

            {/* Selection Ring */}
            {isSelected && (
                <motion.div
                    layoutId="outline"
                    className={`absolute -inset-[2px] border-2 border-${color}-400/60 rounded-[2.1rem] -z-10`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
        </motion.div>
    );
};

export default VibeMontage;
