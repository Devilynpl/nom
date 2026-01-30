import React, { useEffect, useState, useRef, useCallback } from 'react';
import { VibeHandle } from "../ui/VibeHandle";

const VibeLayout = ({ sidebar, center, rightPanel }) => {
    // State for Sidebar Width (Pixels for absolute control)
    const [sidebarWidth, setSidebarWidth] = useState(247); // Default 247px as requested
    const [isResizing, setIsResizing] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Limits
    const minWidth = 100;
    const maxWidth = 1600; // Almost full screen

    const sidebarRef = useRef(null);
    const containerRef = useRef(null);

    // Mouse Move Handler for Resizing
    const startResizing = useCallback(() => {
        setIsResizing(true);
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = useCallback((mouseMoveEvent) => {
        if (isResizing) {
            const newWidth = mouseMoveEvent.clientX; // Absolute X position
            if (newWidth >= minWidth && newWidth <= maxWidth) {
                setSidebarWidth(newWidth);
            }
        }
    }, [isResizing]);

    useEffect(() => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [resize, stopResizing]);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div
            ref={containerRef}
            className="vibe-layout-root flex h-screen w-screen overflow-hidden bg-transparent select-none"
        >
            {/* --- LEFT SIDEBAR --- */}
            <div
                ref={sidebarRef}
                style={{
                    width: isCollapsed ? '0px' : `${sidebarWidth}px`,
                    transition: isResizing ? 'none' : 'width 0.3s ease'
                }}
                className="relative flex-shrink-0 flex flex-col border-r border-white/5 overflow-hidden" // Removed bg-[#0d1117]/60 to let Sidebar handle it or use theme
            >
                <div className={`h-full w-full ${isCollapsed ? 'opacity-0' : ''} transition-opacity duration-300`}>
                    {React.cloneElement(sidebar, { onToggle: toggleCollapse, isCollapsed: isCollapsed })}
                </div>
            </div>

            {/* --- RESIZER HANDLE --- */}
            {!isCollapsed && (
                <div
                    onMouseDown={startResizing}
                    className="w-4 hover:w-6 transition-all bg-transparent hover:bg-cyan-500/20 cursor-col-resize z-50 flex items-center justify-center -ml-2 h-full group"
                    title="Drag to Resize"
                >
                    <div className="w-[2px] h-full bg-cyan-500/30 group-hover:bg-cyan-400 shadow-[0_0_10px_rgba(0,242,255,0.2)] transition-colors" />
                </div>
            )}

            {/* --- CENTER STAGE --- */}
            <div className="flex-1 flex flex-col relative min-w-0 overflow-hidden bg-transparent"> {/* Removed bg-black/40 to allow themes to work directly with WaterBackground */}
                {/* Visual "Restore" Button if collapsed */}
                {isCollapsed && (
                    <button
                        onClick={toggleCollapse}
                        className="absolute top-6 left-6 z-[9999] p-3 bg-cyan-500/20 hover:bg-cyan-500/40 rounded-xl border border-cyan-500/30 backdrop-blur-xl text-cyan-400 shadow-[0_0_20px_rgba(0,242,255,0.3)] animate-pulse"
                        title="Restore Sidebar"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 17l5-5-5-5M6 17l5-5-5-5" /></svg>
                    </button>
                )}

                {center}
            </div>

            {/* --- RIGHT PANEL (Optional, Fixed Width or Flexible but distinct flow) --- */}
            {rightPanel && (
                <div className="w-[350px] flex-shrink-0 border-l border-white/10 bg-[#0d1117]/80 backdrop-blur-lg hidden xl:flex flex-col">
                    {/* Simple Right Handle placeholder if we wanted resizing there too, but keeping it simple for now */}
                    {rightPanel}
                </div>
            )}
        </div>
    );
};

export default VibeLayout;
