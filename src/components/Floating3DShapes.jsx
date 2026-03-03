'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

/**
 * Floating3DShapes — Animated CSS 3D geometric shapes (cubes, prisms, octahedra)
 * that slowly rotate in 3D space, all built with pure CSS transforms.
 */

function Cube({ size = 80, color = 'rgba(41,151,255,0.06)', style = {}, speed = 20 }) {
    const half = size / 2;
    const faceStyle = (transform) => ({
        position: 'absolute',
        width: size,
        height: size,
        border: `1px solid ${color}`,
        background: color.replace(/[\d.]+\)$/, '0.02)'),
        backdropFilter: 'blur(2px)',
        transform,
    });

    return (
        <div style={{
            position: 'absolute',
            perspective: 600,
            ...style,
        }}>
            <motion.div
                animate={{ rotateX: 360, rotateY: 360 }}
                transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
                style={{
                    width: size,
                    height: size,
                    transformStyle: 'preserve-3d',
                    position: 'relative',
                }}
            >
                <div style={faceStyle(`translateZ(${half}px)`)} />
                <div style={faceStyle(`rotateY(180deg) translateZ(${half}px)`)} />
                <div style={faceStyle(`rotateY(90deg) translateZ(${half}px)`)} />
                <div style={faceStyle(`rotateY(-90deg) translateZ(${half}px)`)} />
                <div style={faceStyle(`rotateX(90deg) translateZ(${half}px)`)} />
                <div style={faceStyle(`rotateX(-90deg) translateZ(${half}px)`)} />
            </motion.div>
        </div>
    );
}

function Prism({ size = 60, color = 'rgba(168,85,247,0.06)', style = {}, speed = 25 }) {
    const h = size * 0.866; // equilateral triangle height
    const triStyle = {
        width: 0,
        height: 0,
        borderLeft: `${size / 2}px solid transparent`,
        borderRight: `${size / 2}px solid transparent`,
        borderBottom: `${h}px solid ${color}`,
        position: 'absolute',
    };

    return (
        <div style={{ position: 'absolute', perspective: 500, ...style }}>
            <motion.div
                animate={{ rotateY: 360, rotateZ: 360 }}
                transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
                style={{
                    width: size,
                    height: h,
                    transformStyle: 'preserve-3d',
                    position: 'relative',
                }}
            >
                <div style={{ ...triStyle, transform: `rotateY(0deg) translateZ(${size / 3}px)` }} />
                <div style={{ ...triStyle, transform: `rotateY(120deg) translateZ(${size / 3}px)` }} />
                <div style={{ ...triStyle, transform: `rotateY(240deg) translateZ(${size / 3}px)` }} />
            </motion.div>
        </div>
    );
}

function Ring3D({ size = 100, color = 'rgba(236,72,153,0.05)', style = {}, speed = 30 }) {
    return (
        <div style={{ position: 'absolute', perspective: 400, ...style }}>
            <motion.div
                animate={{ rotateX: 360, rotateY: 180 }}
                transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
                style={{
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    border: `1.5px solid ${color}`,
                    transformStyle: 'preserve-3d',
                }}
            />
        </div>
    );
}

export default function Floating3DShapes() {
    return (
        <div
            aria-hidden="true"
            style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 0,
                overflow: 'hidden',
            }}
        >
            {/* Cubes */}
            <Cube size={70} style={{ top: '15%', left: '5%' }} speed={25} color="rgba(41,151,255,0.04)" />
            <Cube size={50} style={{ top: '55%', right: '8%' }} speed={30} color="rgba(168,85,247,0.04)" />
            <Cube size={40} style={{ top: '78%', left: '12%' }} speed={20} color="rgba(52,211,153,0.04)" />

            {/* Prisms */}
            <Prism size={55} style={{ top: '30%', right: '15%' }} speed={22} color="rgba(236,72,153,0.04)" />
            <Prism size={45} style={{ top: '65%', left: '20%' }} speed={28} color="rgba(41,151,255,0.04)" />

            {/* 3D Rings */}
            <Ring3D size={90} style={{ top: '10%', right: '25%' }} speed={35} color="rgba(168,85,247,0.03)" />
            <Ring3D size={120} style={{ top: '45%', left: '3%' }} speed={40} color="rgba(41,151,255,0.03)" />
            <Ring3D size={70} style={{ top: '85%', right: '20%' }} speed={28} color="rgba(236,72,153,0.03)" />
        </div>
    );
}
