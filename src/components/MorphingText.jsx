'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MorphingText({
    texts = ['Hello'],
    interval = 3000,
    className = '',
    style = {},
}) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % texts.length);
        }, interval);
        return () => clearInterval(timer);
    }, [texts.length, interval]);

    return (
        <span className={className} style={{ position: 'relative', display: 'inline-block', ...style }}>
            <AnimatePresence mode="wait">
                <motion.span
                    key={texts[index]}
                    initial={{ opacity: 0, y: 12, filter: 'blur(6px)', scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                    exit={{ opacity: 0, y: -12, filter: 'blur(6px)', scale: 0.95 }}
                    transition={{
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
                >
                    {texts[index]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}
