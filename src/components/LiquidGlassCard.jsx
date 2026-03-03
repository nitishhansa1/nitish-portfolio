'use client';

import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function LiquidGlassCard({
    children,
    className = '',
    style = {},
    tilt = false,
    padding = '2rem',
    motionProps = {},
}) {
    const cardRef = useRef(null);
    const [mouseState, setMouseState] = useState({
        x: 50,
        y: 50,
        tiltX: 0,
        tiltY: 0,
        isHovering: false,
    });

    const handleMouseMove = useCallback((e) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = (x / rect.width) * 100;
        const py = (y / rect.height) * 100;

        const state = {
            x: px,
            y: py,
            isHovering: true,
        };

        if (tilt) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            state.tiltX = ((y - centerY) / centerY) * -4;
            state.tiltY = ((x - centerX) / centerX) * 4;
        }

        setMouseState((prev) => ({ ...prev, ...state }));
    }, [tilt]);

    const handleMouseLeave = useCallback(() => {
        setMouseState({ x: 50, y: 50, tiltX: 0, tiltY: 0, isHovering: false });
    }, []);

    const tiltTransform = tilt && mouseState.isHovering
        ? `perspective(1000px) rotateX(${mouseState.tiltX}deg) rotateY(${mouseState.tiltY}deg) scale3d(1.015, 1.015, 1.015)`
        : tilt
            ? 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
            : undefined;

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`liquid-glass-card ${className}`}
            style={{
                padding,
                transform: tiltTransform,
                transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease',
                willChange: 'transform',
                ...style,
            }}
            {...motionProps}
        >
            {/* Mouse-tracking refraction highlight */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    borderRadius: 24,
                    background: `radial-gradient(
                        600px circle at ${mouseState.x}% ${mouseState.y}%,
                        var(--liquid-refraction),
                        transparent 50%
                    )`,
                    opacity: mouseState.isHovering ? 1 : 0,
                    transition: 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                    zIndex: 1,
                }}
            />

            {/* Content (above refraction layer) */}
            <div style={{ position: 'relative', zIndex: 2 }}>
                {children}
            </div>
        </motion.div>
    );
}
