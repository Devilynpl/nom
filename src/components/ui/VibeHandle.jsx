import React from 'react';
import { Separator as PanelResizeHandle } from "react-resizable-panels";
import "./VibeHandle.css";

export const VibeHandle = ({ className = "", id, disabled = false }) => {
    return (
        <PanelResizeHandle
            className={`vibe-resize-handle ${className}`}
            id={id}
            disabled={disabled}
        >
            <div className="vibe-handle-bar" />
        </PanelResizeHandle>
    );
};
