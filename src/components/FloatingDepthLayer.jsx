'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';

/**
 * FloatingDepthLayer — Creates 3D-floating decorative elements at different
 * z-depths that react to scroll and mouse position.
 *
 * Props:
 *  - sectionId: which section this floats in ('about' | 'projects' | 'skills' | 'contact')
 */

const layerConfigs = {
    about: [
        { shape: 'ring', size: 60, x: '10%', y: '20%', depth: 0.3, color: 'rgba(41,151,255,0.08)' },
        { shape: 'dot', size: 8, x: '85%', y: '30%', depth: 0.6, color: 'rgba(168,85,247,0.12)' },
        { shape: 'cross', size: 20, x: '90%', y: '70%', depth: 0.4, color: 'rgba(41,151,255,0.06)' },
        { shape: 'ring', size: 30, x: '5%', y: '75%', depth: 0.7, color: 'rgba(236,72,153,0.06)' },
    ],
    projects: [
        { shape: 'diamond', size: 16, x: '8%', y: '15%', depth: 0.5, color: 'rgba(168,85,247,0.08)' },
        { shape: 'ring', size: 45, x: '92%', y: '25%', depth: 0.3, color: 'rgba(41,151,255,0.05)' },
        { shape: 'dot', size: 6, x: '15%', y: '80%', depth: 0.8, color: 'rgba(52,211,153,0.1)' },
    ],
    skills: [
        { shape: 'cross', size: 24, x: '92%', y: '20%', depth: 0.4, color: 'rgba(41,151,255,0.06)' },
        { shape: 'dot', size: 10, x: '5%', y: '50%', depth: 0.7, color: 'rgba(168,85,247,0.1)' },
        { shape: 'ring', size: 50, x: '88%', y: '75%', depth: 0.3, color: 'rgba(236,72,153,0.04)' },
    ],
    contact: [
        { shape: 'diamond', size: 14, x: '90%', y: '20%', depth: 0.6, color: 'rgba(41,151,255,0.08)' },
        { shape: 'ring', size: 35, x: '8%', y: '40%', depth: 0.3, color: 'rgba(168,85,247,0.05)' },
    ],
};

function ShapeRenderer({ shape, size, color }) {
    if (shape === 'ring') {
        return (
            <div style={{
                width: size, height: size, borderRadius: '50%',
                border: `1.5px solid ${color}`, background: 'transparent',
            }} />
        );
    }
    if (shape === 'dot') {
        return (
            <div style={{
                width: size, height: size, borderRadius: '50%',
                background: color,
            }} />
        );
    }
    if (shape === 'cross') {
        return (
            <div style={{ position: 'relative', width: size, height: size }}>
                <div style={{
                    position: 'absolute', left: '50%', top: 0,
                    width: 1.5, height: '100%', background: color,
                    transform: 'translateX(-50%)',
                }} />
                <div style={{
                    position: 'absolute', top: '50%', left: 0,
                    width: '100%', height: 1.5, background: color,
                    transform: 'translateY(-50%)',
                }} />
            </div>
        );
    }
    if (shape === 'diamond') {
        return (
            <div style={{
                width: size, height: size,
                border: `1.5px solid ${color}`,
                transform: 'rotate(45deg)',
                background: 'transparent',
            }} />
        );
    }
    return null;
}

export default function FloatingDepthLayer({ sectionId = 'about' }) {
    const layers = layerConfigs[sectionId] || layerConfigs.about;
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothX = useSpring(mouseX, { stiffness: 15, damping: 25 });
    const smoothY = useSpring(mouseY, { stiffness: 15, damping: 25 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
            mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            overflow: 'hidden', zIndex: 0,
        }}>
            {layers.map((layer, i) => {
                const parallaxX = useTransform(smoothX, [-1, 1], [-20 * layer.depth, 20 * layer.depth]);
                const parallaxY = useTransform(smoothY, [-1, 1], [-14 * layer.depth, 14 * layer.depth]);

                return (
                    <motion.div
                        key={i}
                        style={{
                            position: 'absolute',
                            left: layer.x,
                            top: layer.y,
                            x: parallaxX,
                            y: parallaxY,
                            willChange: 'transform',
                        }}
                        animate={{
                            y: [0, -4, 0],
                        }}
                        transition={{
                            y: { duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' },
                        }}
                    >
                        <ShapeRenderer shape={layer.shape} size={layer.size} color={layer.color} />
                    </motion.div>
                );
            })}
        </div>
    );
}
