'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * CustomCursor — Premium cinematic cursor:
 *  - Small dot follows cursor exactly
 *  - Larger ring follows with spring delay
 *  - Ring expands on hover over interactive elements
 *  - Ring shrinks & dot hides on text hover
 *  - Hidden on touch devices
 */
export default function CustomCursor() {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 30, stiffness: 300, mass: 0.5 };
    const ringX = useSpring(cursorX, springConfig);
    const ringY = useSpring(cursorY, springConfig);

    const [isHovering, setIsHovering] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isTouch, setIsTouch] = useState(false);

    const handleMouseMove = useCallback((e) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
    }, [cursorX, cursorY]);

    useEffect(() => {
        // Detect touch
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            setIsTouch(true);
            return;
        }

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Track interactive element hovers
        const handleHoverStart = () => setIsHovering(true);
        const handleHoverEnd = () => setIsHovering(false);
        const handleHidden = () => setIsHidden(true);
        const handleVisible = () => setIsHidden(false);

        const observer = new MutationObserver(() => {
            document.querySelectorAll('a, button, [role="button"], .magnetic-hover, .liquid-pill, .liquid-glass-card').forEach((el) => {
                el.removeEventListener('mouseenter', handleHoverStart);
                el.removeEventListener('mouseleave', handleHoverEnd);
                el.addEventListener('mouseenter', handleHoverStart);
                el.addEventListener('mouseleave', handleHoverEnd);
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Initial bind
        document.querySelectorAll('a, button, [role="button"], .magnetic-hover, .liquid-pill, .liquid-glass-card').forEach((el) => {
            el.addEventListener('mouseenter', handleHoverStart);
            el.addEventListener('mouseleave', handleHoverEnd);
        });

        // Hide when leaving window
        document.addEventListener('mouseleave', handleHidden);
        document.addEventListener('mouseenter', handleVisible);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleHidden);
            document.removeEventListener('mouseenter', handleVisible);
            observer.disconnect();
        };
    }, [handleMouseMove]);

    // Respect prefers-reduced-motion
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mq.matches) setIsTouch(true); // disable custom cursor
    }, []);

    if (isTouch) return null;

    return (
        <>
            {/* Dot — follows cursor exactly */}
            <motion.div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    x: cursorX,
                    y: cursorY,
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#F8FAFC',
                    pointerEvents: 'none',
                    zIndex: 99999,
                    translateX: '-50%',
                    translateY: '-50%',
                    mixBlendMode: 'difference',
                }}
                animate={{
                    scale: isHidden ? 0 : isHovering ? 0 : 1,
                    opacity: isHidden ? 0 : 1,
                }}
                transition={{ duration: 0.15 }}
            />
            {/* Ring — follows with spring delay */}
            <motion.div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    x: ringX,
                    y: ringY,
                    width: isHovering ? 48 : 32,
                    height: isHovering ? 48 : 32,
                    borderRadius: '50%',
                    border: `1.5px solid rgba(248, 250, 252, ${isHovering ? 0.6 : 0.3})`,
                    background: isHovering ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                    pointerEvents: 'none',
                    zIndex: 99998,
                    translateX: '-50%',
                    translateY: '-50%',
                    mixBlendMode: 'difference',
                    transition: 'width 0.3s cubic-bezier(0.22,1,0.36,1), height 0.3s cubic-bezier(0.22,1,0.36,1), border-color 0.3s ease, background 0.3s ease',
                }}
                animate={{
                    scale: isHidden ? 0 : 1,
                    opacity: isHidden ? 0 : 1,
                }}
                transition={{ duration: 0.2 }}
            />
        </>
    );
}
