import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const WaterBackground = ({
    imageUrl = '/img/3.jpg',
    backgroundColor = '#0a0c12',
    resolution = 0.4,
    animated = true
}) => {
    const canvasRef = useRef(null);
    const requestRef = useRef();
    const [isVisible, setIsVisible] = useState(false);

    // Refs for mutable state across re-renders
    const stateRef = useRef({
        mousePos: { x: -1000, y: -1000 },
        lastMousePos: { x: -1000, y: -1000 },
        ripples: [],
        isLoaded: false,
        img: null,
        originalData: null,
        ctx: null,
        originalCtx: null,
        offsetsX: null,
        offsetsY: null,
        imageData: null,
        outputPixels: null
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const originalCanvas = document.createElement('canvas');
        const originalCtx = originalCanvas.getContext('2d', { willReadFrequently: true });

        stateRef.current.ctx = ctx;
        stateRef.current.originalCtx = originalCtx;

        // Configuration
        const config = {
            lensRadius: 60 * resolution,
            lensPower: 5, // Reduced from 20 to 10 for subtler effect
            rippleSpeed: 4 * resolution,
            rippleDecay: 0.5,
            rippleFrequency: 25,
            maxRipples: 100
        };

        const initDimensions = () => {
            if (!stateRef.current.img || !originalCtx) return;

            // Performance: Scale internal resolution
            canvas.width = window.innerWidth * resolution;
            canvas.height = window.innerHeight * resolution;

            originalCanvas.width = canvas.width;
            originalCanvas.height = canvas.height;

            // Buffers
            stateRef.current.offsetsX = new Float32Array(canvas.width * canvas.height);
            stateRef.current.offsetsY = new Float32Array(canvas.width * canvas.height);

            stateRef.current.imageData = ctx.createImageData(canvas.width, canvas.height);
            stateRef.current.outputPixels = stateRef.current.imageData.data;

            const img = stateRef.current.img;

            // Scale logic - 30% smaller than original size (scale = 0.7)
            const w = img.width * resolution * 0.7;
            const h = img.height * resolution * 0.7;
            const x = (canvas.width / 2) - (w / 2);
            const y = (canvas.height / 2) - (h / 2);

            // Clear and Fill
            originalCtx.fillStyle = backgroundColor;
            originalCtx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw image at its original size
            originalCtx.drawImage(img, x, y, w, h);
            ctx.drawImage(img, x, y, w, h);

            stateRef.current.originalData = originalCtx.getImageData(0, 0, canvas.width, canvas.height).data;
        };

        const addRipple = (x, y) => {
            if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) return;

            if (stateRef.current.ripples.length >= config.maxRipples) {
                stateRef.current.ripples.shift();
            }
            stateRef.current.ripples.push({
                x: x,
                y: y,
                age: 0,
                power: 10 // Reduced from 40 to 20
            });
        };

        const render = () => {
            if (!stateRef.current.isLoaded || !stateRef.current.originalData) {
                if (animated) requestRef.current = requestAnimationFrame(render);
                return;
            }

            // Stop loop if not animated
            if (!animated) {
                return;
            }

            const { ripples, mousePos, lastMousePos, offsetsX, offsetsY, originalCtx, originalData, outputPixels, ctx: currentCtx, imageData } = stateRef.current;

            // Zero offsets
            offsetsX.fill(0);
            offsetsY.fill(0);

            // Update ripples
            for (let i = ripples.length - 1; i >= 0; i--) {
                let r = ripples[i];
                r.age += config.rippleSpeed;
                r.power -= config.rippleDecay;
                if (r.power <= 0) ripples.splice(i, 1);
            }

            // Mouse movement
            if (mousePos.x >= 0) {
                if (lastMousePos.x < 0) {
                    stateRef.current.lastMousePos = { ...mousePos };
                } else {
                    const dx = mousePos.x - lastMousePos.x;
                    const dy = mousePos.y - lastMousePos.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist > 5 * resolution) {
                        addRipple(mousePos.x, mousePos.y);
                        stateRef.current.lastMousePos = { ...mousePos };
                    }
                }
            }

            // Optimization
            if (ripples.length === 0 && mousePos.x < 0) {
                if (originalCtx && canvas.width > 0) {
                    currentCtx.putImageData(originalCtx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
                }
                if (animated) requestRef.current = requestAnimationFrame(render);
                return;
            }

            const w = canvas.width;
            const h = canvas.height;

            // Lens Effect
            if (mousePos.x >= 0) {
                const r = config.lensRadius;
                const r2 = r * r;
                const xMin = Math.max(0, Math.floor(mousePos.x - r));
                const xMax = Math.min(w, Math.floor(mousePos.x + r));
                const yMin = Math.max(0, Math.floor(mousePos.y - r));
                const yMax = Math.min(h, Math.floor(mousePos.y + r));

                for (let y = yMin; y < yMax; y++) {
                    const rowOffset = y * w;
                    const dy = y - mousePos.y;
                    const dy2 = dy * dy;

                    for (let x = xMin; x < xMax; x++) {
                        const dx = x - mousePos.x;
                        const dist2 = dx * dx + dy2;
                        if (dist2 <= r2) {
                            const idx = rowOffset + x;
                            const dist = Math.sqrt(dist2);
                            if (dist > 0) {
                                const amount = Math.sin(dist / r * Math.PI) * config.lensPower;
                                offsetsX[idx] += (dx / dist) * amount;
                                offsetsY[idx] += (dy / dist) * amount;
                            }
                        }
                    }
                }
            }

            // Ripple Effect
            ripples.forEach(r => {
                const thickness = 40 * resolution;
                const innerRadius = Math.max(0, r.age - thickness);
                const outerRadius = r.age + thickness;
                const outerR2 = outerRadius * outerRadius;
                const innerR2 = innerRadius * innerRadius;
                const rX = Math.floor(r.x);
                const rY = Math.floor(r.y);

                const xMin = Math.max(0, Math.floor(rX - outerRadius));
                const xMax = Math.min(w, Math.floor(rX + outerRadius));
                const yMin = Math.max(0, Math.floor(rY - outerRadius));
                const yMax = Math.min(h, Math.floor(rY + outerRadius));

                for (let y = yMin; y < yMax; y++) {
                    const rowOffset = y * w;
                    const dy = y - rY;
                    const dy2 = dy * dy;

                    for (let x = xMin; x < xMax; x++) {
                        const dx = x - rX;
                        const dist2 = dx * dx + dy2;

                        if (dist2 <= outerR2 && dist2 >= innerR2) {
                            const dist = Math.sqrt(dist2);
                            const wavePhase = (dist - r.age) / thickness * Math.PI;
                            const amount = -Math.sin(wavePhase) * r.power * 0.5;

                            if (dist > 0) {
                                const idx = rowOffset + x;
                                offsetsX[idx] += (dx / dist) * amount;
                                offsetsY[idx] += (dy / dist) * amount;
                            }
                        }
                    }
                }
            });

            // Apply Offsets
            const totalPixels = w * h;
            for (let i = 0; i < totalPixels; i++) {
                const offX = offsetsX[i];
                const offY = offsetsY[i];
                const idx4 = i * 4;

                if (offX === 0 && offY === 0) {
                    outputPixels[idx4] = originalData[idx4];
                    outputPixels[idx4 + 1] = originalData[idx4 + 1];
                    outputPixels[idx4 + 2] = originalData[idx4 + 2];
                    outputPixels[idx4 + 3] = originalData[idx4 + 3];
                } else {
                    const x = i % w;
                    const y = Math.floor(i / w);

                    let srcX = Math.floor(x - offX);
                    let srcY = Math.floor(y - offY);

                    if (srcX < 0) srcX = 0; else if (srcX >= w) srcX = w - 1;
                    if (srcY < 0) srcY = 0; else if (srcY >= h) srcY = h - 1;

                    const srcIdx = (srcY * w + srcX) * 4;

                    outputPixels[idx4] = originalData[srcIdx];
                    outputPixels[idx4 + 1] = originalData[srcIdx + 1];
                    outputPixels[idx4 + 2] = originalData[srcIdx + 2];
                    outputPixels[idx4 + 3] = originalData[srcIdx + 3];
                }
            }

            currentCtx.putImageData(imageData, 0, 0);
            if (animated) requestRef.current = requestAnimationFrame(render);
        };

        const handleMouseMove = (e) => {
            if (!animated) return;
            const rect = canvas.getBoundingClientRect();
            stateRef.current.mousePos.x = (e.clientX - rect.left) * resolution;
            stateRef.current.mousePos.y = (e.clientY - rect.top) * resolution;
        };

        const handleMouseDown = () => {
            if (stateRef.current.isLoaded && !requestRef.current && animated) {
                requestRef.current = requestAnimationFrame(render);
            }
        };

        const handleResize = () => {
            if (stateRef.current.isLoaded) initDimensions();
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('resize', handleResize);

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;
        img.onload = () => {
            stateRef.current.img = img;
            stateRef.current.isLoaded = true;
            initDimensions();
            // Start the loop only if animated
            if (animated && !requestRef.current) {
                requestRef.current = requestAnimationFrame(render);
            } else if (!animated) {
                // If not animated, ensure clean image is drawn (initDimensions handles this)
                if (requestRef.current) {
                    cancelAnimationFrame(requestRef.current);
                    requestRef.current = null;
                }
            }
            setIsVisible(true);
        };

        // Handle animation toggle after load
        if (stateRef.current.isLoaded) {
            if (animated) {
                if (!requestRef.current) requestRef.current = requestAnimationFrame(render);
            } else {
                if (requestRef.current) {
                    cancelAnimationFrame(requestRef.current);
                    requestRef.current = null;
                }
                // Reset to clean image
                initDimensions();
            }
        }

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('resize', handleResize);
        };
    }, [imageUrl, resolution, backgroundColor, animated]); // Reruns when props change

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none',
            backgroundColor: backgroundColor,
        }}>
            <canvas
                ref={canvasRef}
                style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 1.2s ease-in-out'
                }}
            />
        </div>
    );
};

WaterBackground.propTypes = {
    imageUrl: PropTypes.string,
    backgroundColor: PropTypes.string,
    resolution: PropTypes.number
};

export default WaterBackground;
