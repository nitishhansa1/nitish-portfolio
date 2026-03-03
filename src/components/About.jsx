'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import LiquidGlassCard from './LiquidGlassCard';
import TextReveal from './TextReveal';
import ScrollVelocity from './ScrollVelocity';
import FloatingDepthLayer from './FloatingDepthLayer';

const EASE_PREMIUM = [0.22, 1, 0.36, 1];

/* ── Animated counter hook ── */
function AnimatedCounter({ target, suffix = '', duration = 2 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const step = target / (duration * 60);
        const interval = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(interval); }
            else { setCount(Math.floor(start)); }
        }, 1000 / 60);
        return () => clearInterval(interval);
    }, [isInView, target, duration]);

    return (
        <span ref={ref} className="text-gradient" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800 }}>
            {count}{suffix}
        </span>
    );
}

/* ── Stat Card ── */
function StatCard({ value, suffix, label, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay, ease: EASE_PREMIUM }}
            whileHover={{ scale: 1.05, y: -3 }}
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '1.5rem 1rem',
                background: 'var(--liquid-bg)', border: '1px solid var(--liquid-border)',
                borderRadius: 20, backdropFilter: 'blur(24px) saturate(150%)',
                WebkitBackdropFilter: 'blur(24px) saturate(150%)',
                cursor: 'default', transition: 'box-shadow 0.3s ease',
                boxShadow: 'inset 0 1px 0 var(--liquid-inner-glow)',
            }}
        >
            <AnimatedCounter target={value} suffix={suffix} />
            <span style={{ fontSize: '0.8rem', color: 'var(--fg-secondary)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {label}
            </span>
        </motion.div>
    );
}

/* ── Magnetic skill pill ── */
function MagneticPill({ children, index }) {
    const ref = useRef(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const handleMouseMove = (e) => {
        const rect = ref.current.getBoundingClientRect();
        setPos({ x: (e.clientX - rect.left - rect.width / 2) * 0.3, y: (e.clientY - rect.top - rect.height / 2) * 0.3 });
    };
    return (
        <motion.span
            ref={ref}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.04, ease: EASE_PREMIUM }}
            animate={{ x: pos.x, y: pos.y }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setPos({ x: 0, y: 0 })}
            whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(41,151,255,0.2)' }}
            className="liquid-pill"
            style={{ color: 'var(--fg)', cursor: 'default', display: 'inline-block' }}
        >
            {children}
        </motion.span>
    );
}

const stats = [
    { value: 5, suffix: '+', label: 'Years Experience' },
    { value: 50, suffix: '+', label: 'Projects Built' },
    { value: 15, suffix: '+', label: 'AI Models Shipped' },
    { value: 99, suffix: '%', label: 'Client Satisfaction' },
];
const skills = [
    'Python', 'JavaScript', 'React', 'Next.js', 'Node.js', 'TensorFlow',
    'PyTorch', 'AWS', 'Docker', 'TypeScript', 'Three.js', 'Machine Learning',
];

export default function About() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    /* ── Entry-only: image/bio from left, text from vertical ── */
    const bioX = useTransform(scrollYProgress, [0.05, 0.25], [-30, 0]);
    const bioY = useTransform(scrollYProgress, [0.05, 0.25], [20, 0]);
    const bioOpacity = useTransform(scrollYProgress, [0.05, 0.22], [0, 1]);

    /* ── Skills card: vertical only ── */
    const skillsY = useTransform(scrollYProgress, [0.1, 0.3], [30, 0]);
    const skillsOpacity = useTransform(scrollYProgress, [0.08, 0.25], [0, 1]);

    return (
        <section ref={sectionRef} id="about" style={{ padding: 'var(--section-gap) 0', position: 'relative' }}>
            <FloatingDepthLayer sectionId="about" />
            <div className="container-main">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="section-label">About</p>
                    <TextReveal as="h2" className="section-title" delay={0.1} staggerDelay={0.06}>
                        Building the future with code and AI
                    </TextReveal>
                </motion.div>

                <ScrollVelocity effect="skew" intensity={0.3}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 mb-12">
                        {stats.map((stat, i) => (
                            <StatCard key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} delay={i * 0.1} />
                        ))}
                    </div>
                </ScrollVelocity>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                    {/* Bio — subtle left entry + upward */}
                    <motion.div style={{ x: bioX, y: bioY, opacity: bioOpacity, willChange: 'transform, opacity' }}>
                        <LiquidGlassCard tilt padding="2rem 2.5rem">
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '1.2rem', letterSpacing: '-0.02em', color: 'var(--fg)' }}>
                                Who I Am
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <p style={{ color: 'var(--fg-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                                    I&apos;m a passionate AI Developer and Software Engineer with a deep love for
                                    creating intelligent systems and elegant digital experiences. With expertise spanning
                                    full-stack development, machine learning, and creative technology, I bridge the gap
                                    between cutting-edge AI research and real-world applications.
                                </p>
                                <p style={{ color: 'var(--fg-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                                    My work focuses on building scalable, performant software powered by artificial
                                    intelligence — from neural networks and NLP models to immersive web experiences
                                    that push the boundaries of what&apos;s possible on the web.
                                </p>
                            </div>
                            <motion.div
                                style={{ marginTop: '1.5rem', height: 3, borderRadius: 2, background: 'linear-gradient(90deg, var(--accent), #a855f7, #ec4899)', transformOrigin: 'left' }}
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, delay: 0.5 }}
                            />
                        </LiquidGlassCard>
                    </motion.div>

                    {/* Skills — vertical entry only */}
                    <motion.div style={{ y: skillsY, opacity: skillsOpacity, willChange: 'transform, opacity' }}>
                        <LiquidGlassCard padding="2rem 2.5rem">
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '-0.02em', color: 'var(--fg)' }}>
                                Core Technologies
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {skills.map((skill, i) => <MagneticPill key={skill} index={i}>{skill}</MagneticPill>)}
                            </div>
                        </LiquidGlassCard>
                    </motion.div>
                </div>


            </div>
        </section>
    );
}
