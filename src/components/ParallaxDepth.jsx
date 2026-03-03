'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * ParallaxDepth — Creates layered parallax depth effect.
 * Wraps children and moves them at different scroll speeds to create depth.
 *
 * Props:
 *  - speed: multiplier for scroll offset (negative = moves up faster, positive = lags behind)
 *  - children: content to apply parallax to
 *  - className, style: passthrough
 */
export default function ParallaxDepth({
    children,
    speed = 0.5,
    className = '',
    style = {},
}) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], [speed * -100, speed * 100]);

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{ y, ...style }}
        >
            {children}
        </motion.div>
    );
}
