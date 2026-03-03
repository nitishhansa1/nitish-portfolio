'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * TechOrbit3D — A 3D rotating orbit of tech icon labels.
 * Pure CSS 3D transforms, no Three.js needed.
 */

const techItems = [
    { label: 'React', color: '#61dafb' },
    { label: 'Python', color: '#3776ab' },
    { label: 'TensorFlow', color: '#ff6f00' },
    { label: 'Node.js', color: '#68a063' },
    { label: 'Next.js', color: '#808080' },
    { label: 'TypeScript', color: '#3178c6' },
    { label: 'Docker', color: '#2496ed' },
    { label: 'AWS', color: '#ff9900' },
];

export default function TechOrbit3D() {
    const containerRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useSpring(useTransform(mouseY, [-1, 1], [12, -12]), { stiffness: 20, damping: 25 });
    const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-12, 12]), { stiffness: 20, damping: 25 });
    const [autoRotate, setAutoRotate] = useState(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            mouseX.set(((e.clientX - cx) / (rect.width / 2)));
            mouseY.set(((e.clientY - cy) / (rect.height / 2)));
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    // Auto-rotation
    useEffect(() => {
        const interval = setInterval(() => {
            setAutoRotate(prev => prev + 0.15);
        }, 1000 / 30);
        return () => clearInterval(interval);
    }, []);

    const radius = 140;
    const count = techItems.length;

    return (
        <div
            ref={containerRef}
            style={{
                width: 320,
                height: 320,
                perspective: 800,
                perspectiveOrigin: 'center center',
                position: 'relative',
                margin: '0 auto',
            }}
        >
            <motion.div
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                    rotateX,
                    rotateY,
                }}
            >
                {/* Center hub */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: 60,
                    height: 60,
                    transform: 'translate(-50%, -50%) translateZ(20px)',
                    borderRadius: '50%',
                    background: 'var(--liquid-bg)',
                    border: '1px solid var(--liquid-border)',
                    backdropFilter: 'blur(16px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    boxShadow: 'inset 0 1px 0 var(--liquid-inner-glow), 0 0 30px rgba(41,151,255,0.1)',
                }}>
                    ⚡
                </div>

                {/* Orbit ring */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: radius * 2,
                    height: radius * 2,
                    transform: `translate(-50%, -50%) rotateX(65deg) translateZ(0px)`,
                    borderRadius: '50%',
                    border: '1px solid var(--liquid-border)',
                    opacity: 0.4,
                }} />

                {/* Orbiting items */}
                {techItems.map((item, i) => {
                    const angle = (360 / count) * i + autoRotate;
                    const rad = (angle * Math.PI) / 180;
                    const x = Math.cos(rad) * radius;
                    const z = Math.sin(rad) * radius * 0.4; // flattened ellipse for 3D perspective
                    const y = Math.sin(rad) * radius * 0.15; // slight vertical movement
                    const scale = 0.7 + ((z + radius * 0.4) / (radius * 0.8)) * 0.4; // depth scaling
                    const opacity = 0.5 + ((z + radius * 0.4) / (radius * 0.8)) * 0.5;

                    return (
                        <motion.div
                            key={item.label}
                            style={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                transform: `translate(-50%, -50%) translate3d(${x}px, ${y - 10}px, ${z}px) scale(${scale})`,
                                opacity,
                                zIndex: Math.round(z + 200),
                            }}
                            whileHover={{ scale: scale * 1.3 }}
                        >
                            <div
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: 980,
                                    background: 'var(--liquid-bg)',
                                    border: '1px solid var(--liquid-border)',
                                    backdropFilter: 'blur(12px)',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    color: item.color,
                                    whiteSpace: 'nowrap',
                                    boxShadow: `inset 0 1px 0 var(--liquid-inner-glow), 0 0 15px ${item.color}15`,
                                    cursor: 'default',
                                    userSelect: 'none',
                                }}
                            >
                                {item.label}
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}
