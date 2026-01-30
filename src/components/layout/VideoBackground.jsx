import React from 'react';
import './VideoBackground.css';
import videoSrc from '../../assets/images/VibeMusic.mp4';

const VideoBackground = () => {
    return (
        <div className="video-bg-container">
            <video autoPlay loop muted playsInline className="video-bg">
                <source src={videoSrc} type="video/mp4" />
            </video>
            <div className="video-overlay"></div>
        </div>
    );
};

export default VideoBackground;
