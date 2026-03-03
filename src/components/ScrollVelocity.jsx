'use client';

import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * ScrollVelocity — reacts to scroll speed.
 * Applies a skew based on how fast the user scrolls.
 * Wrap any content to make it feel alive during scrolling.
 *
 * Props:
 *  - children: content to wrap
 *  - intensity: multiplier for the effect (default: 1)
 */
export default function ScrollVelocity({ children, intensity = 1 }) {
    const velocity = useMotionValue(0);
    const smoothVelocity = useSpring(velocity, { stiffness: 100, damping: 30 });
    const lastScrollY = useRef(0);
    const lastTime = useRef(Date.now());

    useEffect(() => {
        const handleScroll = () => {
            const now = Date.now();
            const dt = now - lastTime.current;
            if (dt > 0) {
                const dy = window.scrollY - lastScrollY.current;
                const v = (dy / dt) * 16;
                velocity.set(Math.max(-15, Math.min(15, v * intensity)));
            }
            lastScrollY.current = window.scrollY;
            lastTime.current = now;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [velocity, intensity]);

    return (
        <motion.div style={{ skewY: smoothVelocity }}>
            {children}
        </motion.div>
    );
}
