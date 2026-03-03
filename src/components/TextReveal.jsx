'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * TextReveal — Animates text word-by-word or character-by-character
 * with a smooth clip-path / opacity reveal.
 *
 * Props:
 *  - children: string text to reveal
 *  - mode: 'word' | 'char' (default: 'word')
 *  - delay: base delay before animation starts (default: 0)
 *  - staggerDelay: delay between each word/char (default: 0.04)
 *  - className: optional className for the container
 *  - as: tag name to render (default: 'div')
 *  - once: trigger only once (default: true)
 */
export default function TextReveal({
    children,
    mode = 'word',
    delay = 0,
    staggerDelay = 0.04,
    className = '',
    as = 'div',
    once = true,
    style = {},
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, margin: '-80px' });

    const text = typeof children === 'string' ? children : '';
    const units = mode === 'char'
        ? text.split('')
        : text.split(' ');

    const Tag = as;

    return (
        <Tag ref={ref} className={className} style={{ ...style, display: 'flex', flexWrap: 'wrap', gap: mode === 'word' ? '0.3em' : 0 }}>
            {units.map((unit, i) => (
                <span
                    key={i}
                    style={{
                        display: 'inline-block',
                        overflow: 'hidden',
                        verticalAlign: 'top',
                    }}
                >
                    <motion.span
                        initial={{ y: '110%', opacity: 0 }}
                        animate={isInView ? { y: 0, opacity: 1 } : { y: '110%', opacity: 0 }}
                        transition={{
                            duration: 0.5,
                            delay: delay + i * staggerDelay,
                            ease: [0.25, 0.1, 0.25, 1],
                        }}
                        style={{ display: 'inline-block' }}
                    >
                        {unit === ' ' ? '\u00A0' : unit}
                    </motion.span>
                </span>
            ))}
        </Tag>
    );
}
