'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * GlowCard — A card with an animated gradient border that follows the mouse.
 * Creates a spotlight/aurora effect around the card edges on hover.
 */
export default function GlowCard({ children, className = '', style = {}, glowColor = '#2997ff' }) {
    const cardRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width);
        mouseY.set((e.clientY - rect.top) / rect.height);
    };

    const gradientX = useTransform(springX, [0, 1], [0, 100]);
    const gradientY = useTransform(springY, [0, 1], [0, 100]);

    return (
        <motion.div
            ref={cardRef}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'relative',
                borderRadius: 20,
                overflow: 'hidden',
                ...style,
            }}
        >
            {/* Animated glow border */}
            <motion.div
                style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 20,
                    padding: 1.5,
                    background: useTransform(
                        [gradientX, gradientY],
                        ([x, y]) =>
                            `radial-gradient(circle at ${x}% ${y}%, ${glowColor}40, transparent 50%)`
                    ),
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            {/* Inner content */}
            <div style={{
                position: 'relative',
                zIndex: 1,
                background: 'var(--liquid-bg)',
                borderRadius: 19,
                border: '1px solid var(--liquid-border)',
                backdropFilter: 'blur(20px)',
                padding: '1.5rem 2rem',
                height: '100%',
            }}>
                {children}
            </div>
        </motion.div>
    );
}
