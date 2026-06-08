// src/components/common/VideoBackground.jsx
import React, { useState, useEffect, useRef } from 'react';
import './VideoBackground.css';

const VideoBackground = ({
    videoSrc,
    posterImage,
    children,
    overlayOpacity = 0.7,
    playDelay = 0
}) => {
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!isMobile && videoRef.current && !isPlaying) {
            const timer = setTimeout(() => {
                videoRef.current.play();
                setIsPlaying(true);
            }, playDelay);

            return () => clearTimeout(timer);
        }
    }, [isMobile, playDelay, isPlaying]);

    const handleVideoLoad = () => {
        setIsVideoLoaded(true);
    };

    // For mobile devices, show poster image instead of video
    if (isMobile) {
        return (
            <div className="video-hero video-hero-mobile">
                <div
                    className="video-poster"
                    style={{ backgroundImage: `url(${posterImage})` }}
                />
                <div className="hero-overlay" style={{ opacity: overlayOpacity }}>
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div className="video-hero">
            <video
                ref={videoRef}
                className={`hero-video ${isVideoLoaded ? 'loaded' : 'loading'}`}
                autoPlay
                loop
                muted
                playsInline
                poster={posterImage}
                onCanPlay={handleVideoLoad}
                preload="auto"
            >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {!isVideoLoaded && (
                <div className="video-loading">
                    <div className="loading-spinner" />
                </div>
            )}

            <div className="hero-overlay" style={{ opacity: overlayOpacity }}>
                {children}
            </div>
        </div>
    );
};

export default VideoBackground;