'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * PageLoadCurtain — A dramatic curtain reveal when the page first loads.
 * Shows a logo/initials and then splits open to reveal the site.
 */
export default function PageLoadCurtain() {
    const [isLoading, setIsLoading] = useState(true);
    const [isRevealing, setIsRevealing] = useState(false);

    useEffect(() => {
        // Brief pause to show the logo
        const timer1 = setTimeout(() => setIsRevealing(true), 800);
        const timer2 = setTimeout(() => setIsLoading(false), 1600);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    if (!isLoading) return null;

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 99999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        pointerEvents: isRevealing ? 'none' : 'all',
                    }}
                >
                    {/* Top curtain */}
                    <motion.div
                        animate={{ y: isRevealing ? '-100%' : '0%' }}
                        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '50%',
                            background: 'var(--bg, #000)',
                        }}
                    />
                    {/* Bottom curtain */}
                    <motion.div
                        animate={{ y: isRevealing ? '100%' : '0%' }}
                        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: '50%',
                            background: 'var(--bg, #000)',
                        }}
                    />
                    {/* Logo/initials */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: isRevealing ? 0 : 1,
                            scale: isRevealing ? 1.5 : 1,
                        }}
                        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                        style={{
                            position: 'relative',
                            zIndex: 2,
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                            fontWeight: 800,
                            letterSpacing: '-0.04em',
                            background: 'linear-gradient(135deg, var(--accent, #2997ff), #a855f7)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        NH
                    </motion.div>
                    {/* Loading bar */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isRevealing ? 1 : 0.6 }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                        style={{
                            position: 'absolute',
                            bottom: '48%',
                            left: '35%',
                            width: '30%',
                            height: 2,
                            borderRadius: 1,
                            background: 'linear-gradient(90deg, var(--accent, #2997ff), #a855f7)',
                            transformOrigin: 'left',
                            zIndex: 2,
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
