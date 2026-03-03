'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import dynamic from 'next/dynamic';
import MagneticButton from './MagneticButton';
import MorphingText from './MorphingText';

const FloatingParticles = dynamic(() => import('./FloatingParticles'), { ssr: false });

const EASE_PREMIUM = [0.22, 1, 0.36, 1];

export default function Hero() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });

    /* ── Scroll transforms — upward only ── */
    const headlineY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
    const subtitleY = useTransform(scrollYProgress, [0, 0.5], [0, -30]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

    /* ── Background: slow X drift + subtle scale ── */
    const bgX = useTransform(scrollYProgress, [0, 1], [0, 80]);
    const bgScale = useTransform(scrollYProgress, [0, 0.5], [0.98, 1]);
    const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    /* ── Mouse parallax (kept subtle) ── */
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 25, damping: 35 });
    const springY = useSpring(mouseY, { stiffness: 25, damping: 35 });
    const textParallaxX = useTransform(springX, [-1, 1], [6, -6]);
    const textParallaxY = useTransform(springY, [-1, 1], [4, -4]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
            mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    const subtitles = [
        'Building Intelligent Systems.',
        'Designing Future-Ready Experiences.',
    ];

    return (
        <section
            ref={sectionRef}
            id="hero"
            className="hero-section relative flex items-center justify-center overflow-hidden"
            style={{ minHeight: '100svh' }}
        >
            <div className="hero-bg-gradient" />

            {/* Background — slow X drift only */}
            <motion.div
                style={{
                    position: 'absolute',
                    inset: 0,
                    x: bgX,
                    opacity: bgOpacity,
                    willChange: 'transform, opacity',
                }}
            >
                <FloatingParticles />
            </motion.div>

            {/* Headline — upward only */}
            <motion.div
                className="container-main relative z-10 flex flex-col items-center text-center"
                style={{
                    opacity: textOpacity,
                    x: textParallaxX,
                    willChange: 'transform, opacity',
                }}
            >
                {/* Label */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.3, ease: EASE_PREMIUM }}
                >
                    <p className="hero-label">Portfolio</p>
                </motion.div>

                {/* Name — cinematic clip-path reveal + gentle float */}
                <motion.div style={{ y: headlineY }}>
                    <motion.h1
                        initial={{ clipPath: 'inset(100% 0 0 0)' }}
                        animate={{ clipPath: 'inset(0% 0 0 0)' }}
                        transition={{ duration: 1.2, delay: 0.4, ease: EASE_PREMIUM }}
                        className="hero-name"
                    >
                        <motion.span
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
                            style={{ display: 'inline-block' }}
                        >
                            <span style={{ color: 'var(--fg)' }}>Nitish </span>
                            <span className="hero-name-gradient">Hansa</span>
                        </motion.span>
                    </motion.h1>
                </motion.div>

                {/* Subtitle — slight upward only */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.7, ease: EASE_PREMIUM }}
                    className="hero-subtitle"
                    style={{ y: subtitleY }}
                >
                    <p>{subtitles[0]}</p>
                    <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <MorphingText
                            texts={['Future-Ready', 'Immersive', 'Intelligent', 'Elegant']}
                            interval={2500}
                            style={{ color: 'var(--accent)', fontWeight: 600 }}
                        />
                        {' Experiences.'}
                    </p>
                </motion.div>

                {/* Buttons — slight upward with subtitle */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.1, ease: EASE_PREMIUM }}
                    className="flex gap-5 flex-wrap justify-center"
                    style={{ marginTop: '2.5rem', y: subtitleY }}
                >
                    <MagneticButton href="#projects" className="btn-hero-primary">
                        View Projects
                    </MagneticButton>
                    <MagneticButton href="#contact" className="btn-hero-secondary">
                        Contact Me
                    </MagneticButton>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8, duration: 1.2 }}
                    className="absolute bottom-10 flex flex-col items-center gap-2"
                >
                    <span style={{
                        fontSize: '0.6rem', color: 'var(--fg-secondary)',
                        letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 500,
                    }}>
                        Scroll
                    </span>
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                            width: 1, height: 24,
                            background: 'linear-gradient(to bottom, var(--accent), transparent)',
                            borderRadius: 1, opacity: 0.4,
                        }}
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}
