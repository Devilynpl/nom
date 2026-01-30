import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';

const DEFAULT_GLOW_COLOR = '0, 242, 255';
const DEFAULT_PARTICLE_COUNT = 8;

const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
    const el = document.createElement('div');
    el.className = 'magic-particle';
    el.style.cssText = `
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
    return el;
};

/**
 * MagicWrapper - Applies interactive effects to any component
 * Wraps children with magnetism, particles, glow, and click effects
 */
const MagicWrapper = ({
    children,
    enableMagnetism = true,
    enableParticles = true,
    enableTilt = false,
    enableClickRipple = true,
    enableBorderGlow = true,
    glowColor = DEFAULT_GLOW_COLOR,
    particleCount = DEFAULT_PARTICLE_COUNT,
    className = ''
}) => {
    const wrapperRef = useRef(null);
    const particlesRef = useRef([]);
    const timeoutsRef = useRef([]);
    const isHoveredRef = useRef(false);
    const memoizedParticles = useRef([]);
    const particlesInitialized = useRef(false);

    const initializeParticles = useCallback(() => {
        if (particlesInitialized.current || !wrapperRef.current) return;

        const { width, height } = wrapperRef.current.getBoundingClientRect();
        memoizedParticles.current = Array.from({ length: particleCount }, () =>
            createParticleElement(Math.random() * width, Math.random() * height, glowColor)
        );
        particlesInitialized.current = true;
    }, [particleCount, glowColor]);

    const clearAllParticles = useCallback(() => {
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];

        particlesRef.current.forEach(particle => {
            gsap.to(particle, {
                scale: 0,
                opacity: 0,
                duration: 0.2,
                ease: 'power2.in',
                onComplete: () => {
                    particle.parentNode?.removeChild(particle);
                }
            });
        });
        particlesRef.current = [];
    }, []);

    const animateParticles = useCallback(() => {
        if (!wrapperRef.current || !isHoveredRef.current) return;

        if (!particlesInitialized.current) {
            initializeParticles();
        }

        memoizedParticles.current.forEach((particle, index) => {
            const timeoutId = setTimeout(() => {
                if (!isHoveredRef.current || !wrapperRef.current) return;

                const clone = particle.cloneNode(true);
                wrapperRef.current.appendChild(clone);
                particlesRef.current.push(clone);

                gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2, ease: 'back.out(1.7)' });

                gsap.to(clone, {
                    x: (Math.random() - 0.5) * 60,
                    y: (Math.random() - 0.5) * 60,
                    rotation: Math.random() * 360,
                    duration: 1.5 + Math.random() * 1.5,
                    ease: 'none',
                    repeat: -1,
                    yoyo: true
                });

                gsap.to(clone, {
                    opacity: 0.4,
                    duration: 1,
                    ease: 'power2.inOut',
                    repeat: -1,
                    yoyo: true
                });
            }, index * 80);

            timeoutsRef.current.push(timeoutId);
        });
    }, [initializeParticles]);

    useEffect(() => {
        if (!wrapperRef.current) return;

        const element = wrapperRef.current;

        const handleMouseEnter = () => {
            isHoveredRef.current = true;
            if (enableParticles) {
                animateParticles();
            }
        };

        const handleMouseLeave = () => {
            isHoveredRef.current = false;
            clearAllParticles();

            if (enableTilt) {
                gsap.to(element, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }

            if (enableMagnetism) {
                gsap.to(element, {
                    x: 0,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }

            if (enableBorderGlow) {
                element.style.setProperty('--glow-intensity', '0');
            }
        };

        const handleMouseMove = e => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            if (enableTilt) {
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;

                gsap.to(element, {
                    rotateX,
                    rotateY,
                    duration: 0.1,
                    ease: 'power2.out',
                    transformPerspective: 1000
                });
            }

            if (enableMagnetism) {
                const magnetX = (x - centerX) * 0.03;
                const magnetY = (y - centerY) * 0.03;

                gsap.to(element, {
                    x: magnetX,
                    y: magnetY,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }

            if (enableBorderGlow) {
                const relativeX = (x / rect.width) * 100;
                const relativeY = (y / rect.height) * 100;
                element.style.setProperty('--glow-x', `${relativeX}%`);
                element.style.setProperty('--glow-y', `${relativeY}%`);
                element.style.setProperty('--glow-intensity', '1');
            }
        };

        const handleClick = e => {
            if (!enableClickRipple) return;

            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const maxDistance = Math.max(
                Math.hypot(x, y),
                Math.hypot(x - rect.width, y),
                Math.hypot(x, y - rect.height),
                Math.hypot(x - rect.width, y - rect.height)
            );

            const ripple = document.createElement('div');
            ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.3) 0%, rgba(${glowColor}, 0.1) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

            element.appendChild(ripple);

            gsap.fromTo(
                ripple,
                { scale: 0, opacity: 1 },
                {
                    scale: 1,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                    onComplete: () => ripple.remove()
                }
            );
        };

        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);
        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('click', handleClick);

        return () => {
            isHoveredRef.current = false;
            element.removeEventListener('mouseenter', handleMouseEnter);
            element.removeEventListener('mouseleave', handleMouseLeave);
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('click', handleClick);
            clearAllParticles();
        };
    }, [animateParticles, clearAllParticles, enableMagnetism, enableParticles, enableTilt, enableClickRipple, enableBorderGlow, glowColor]);

    return (
        <div
            ref={wrapperRef}
            className={`magic-wrapper ${className}`}
            style={{
                position: 'relative',
                '--glow-x': '50%',
                '--glow-y': '50%',
                '--glow-intensity': '0',
                '--glow-color': glowColor
            }}
        >
            {children}
        </div>
    );
};

export default MagicWrapper;
