'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { HiExternalLink, HiCode } from 'react-icons/hi';
import LiquidGlassCard from './LiquidGlassCard';
import TextReveal from './TextReveal';
import FloatingDepthLayer from './FloatingDepthLayer';

const EASE_PREMIUM = [0.22, 1, 0.36, 1];

const projects = [
    {
        title: 'Neural Canvas',
        description: 'An AI-powered art generation platform using diffusion models and GANs to create stunning visual art from text prompts.',
        tags: ['Python', 'PyTorch', 'React', 'FastAPI'],
        demo: '#', github: '#',
        gradient: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
        status: 'Live',
    },
    {
        title: 'SmartFlow Engine',
        description: 'Intelligent workflow automation system leveraging NLP and computer vision to streamline enterprise operations.',
        tags: ['TensorFlow', 'Node.js', 'Docker', 'AWS'],
        demo: '#', github: '#',
        gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        status: 'Live',
    },
    {
        title: 'VoiceForge',
        description: 'Real-time voice synthesis and cloning platform with custom neural architectures for natural speech generation.',
        tags: ['Python', 'Transformers', 'Next.js', 'WebSocket'],
        demo: '#', github: '#',
        gradient: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
        status: 'Beta',
    },
    {
        title: 'DataPulse Dashboard',
        description: 'Interactive analytics dashboard with real-time data visualization, predictive insights, and automated reporting.',
        tags: ['React', 'D3.js', 'GraphQL', 'PostgreSQL'],
        demo: '#', github: '#',
        gradient: 'linear-gradient(135deg, #1D4ED8 0%, #6366F1 100%)',
        status: 'Live',
    },
];

/* ── Individual project card with hover microinteraction ── */
function ProjectCard({ project, index }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: index * 0.12, ease: EASE_PREMIUM }}
            whileHover={{ y: -5 }}
            style={{
                flex: '0 0 min(420px, 80vw)',
                willChange: 'transform, opacity',
            }}
        >
            <LiquidGlassCard tilt padding="0" style={{ cursor: 'pointer', height: '100%' }}>
                <div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                    {/* Gradient header bar */}
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                        <motion.div
                            animate={{ height: isHovered ? 100 : 6 }}
                            transition={{ duration: 0.5, ease: EASE_PREMIUM }}
                            style={{
                                background: project.gradient, width: '100%',
                                borderRadius: '24px 24px 0 0', position: 'relative',
                            }}
                        >
                            <AnimatePresence>
                                {isHovered && (
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        style={{
                                            position: 'absolute', top: 12, right: 16,
                                            padding: '4px 14px', borderRadius: 980,
                                            fontSize: '0.7rem', fontWeight: 600,
                                            textTransform: 'uppercase', letterSpacing: '0.1em',
                                            background: 'rgba(255,255,255,0.2)',
                                            backdropFilter: 'blur(12px)', color: '#fff',
                                            border: '1px solid rgba(255,255,255,0.3)',
                                        }}
                                    >
                                        {project.status}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '1.5rem 2rem 2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <motion.h3
                            animate={{ x: isHovered ? 4 : 0 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                fontFamily: "var(--font-heading), 'Space Grotesk', sans-serif",
                                fontSize: '1.3rem', fontWeight: 600, letterSpacing: '-0.02em',
                                color: 'var(--fg)', marginBottom: '0.75rem',
                            }}
                        >
                            {project.title}
                            <motion.span
                                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -8 }}
                                transition={{ duration: 0.3 }}
                                style={{ marginLeft: 8, display: 'inline-block' }}
                            >
                                →
                            </motion.span>
                        </motion.h3>

                        <p style={{
                            color: 'var(--fg-secondary)', fontSize: '0.88rem',
                            lineHeight: 1.7, marginBottom: '1.5rem', flex: 1,
                        }}>
                            {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-5">
                            {project.tags.map((tag, i) => (
                                <motion.span
                                    key={tag}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.06 + i * 0.04 }}
                                    whileHover={{ scale: 1.1, borderColor: 'var(--accent)' }}
                                    className="liquid-pill"
                                    style={{ padding: '4px 12px', fontSize: '0.72rem', color: 'var(--accent)' }}
                                >
                                    {tag}
                                </motion.span>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <motion.a href={project.demo}
                                className="flex items-center gap-1.5 text-sm font-medium interactive-link"
                                style={{ color: 'var(--accent)', textDecoration: 'none' }}
                                whileHover={{ x: 3 }}
                            >
                                <HiExternalLink size={15} /> Live Demo
                            </motion.a>
                            <motion.a href={project.github}
                                className="flex items-center gap-1.5 text-sm font-medium interactive-link"
                                style={{ color: 'var(--fg-secondary)', textDecoration: 'none' }}
                                whileHover={{ x: 3 }}
                            >
                                <HiCode size={15} /> Source
                            </motion.a>
                        </div>
                    </div>
                </div>
            </LiquidGlassCard>
        </motion.div>
    );
}

/* ── Horizontal scroll gallery ── */
export default function Projects() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end end'],
    });

    /* Vertical scroll → horizontal movement (smooth, reduced speed) */
    const scrollX = useTransform(scrollYProgress, [0, 1], ['5%', '-55%']);

    // Check if we are on a mobile device to disable horizontal scroll
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <section
            ref={sectionRef}
            id="projects"
            style={{
                position: 'relative',
                /* Tall section to drive horizontal scroll on desktop, normal height on mobile */
                height: isMobile ? 'auto' : '140vh',
            }}
        >
            <FloatingDepthLayer sectionId="projects" />

            {/* Sticky container that stays visible while scroll progresses */}
            <div style={{
                position: isMobile ? 'relative' : 'sticky',
                top: 0,
                height: isMobile ? 'auto' : '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                overflow: 'hidden',
                paddingTop: isMobile ? 0 : 'var(--section-gap)',
                paddingBottom: isMobile ? 'var(--section-gap)' : 0,
            }}>
                <div className="container-main">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="section-label">Projects</p>
                        <TextReveal as="h2" className="section-title" delay={0.1} staggerDelay={0.08}>
                            Selected work
                        </TextReveal>
                    </motion.div>
                </div>

                {/* Horizontal scroll track (or vertical stack on mobile) */}
                <motion.div
                    style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? '2rem' : '2rem',
                        x: isMobile ? 0 : scrollX,
                        paddingLeft: isMobile ? '16px' : '48px',
                        paddingRight: isMobile ? '16px' : '20vw',
                        willChange: isMobile ? 'auto' : 'transform',
                        marginTop: '2rem',
                    }}
                >
                    {projects.map((project, i) => (
                        <ProjectCard key={project.title} project={project} index={i} />
                    ))}
                </motion.div>

                {/* Scroll progress indicator (hide on mobile since it is vertical) */}
                {!isMobile && (
                    <div style={{
                        position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
                        display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                        <span style={{
                            fontSize: '0.65rem', color: 'var(--fg-secondary)',
                            letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500,
                        }}>
                            Scroll to explore
                        </span>
                        <motion.div style={{
                            width: 60, height: 2, borderRadius: 1,
                            background: 'var(--liquid-border)', overflow: 'hidden',
                        }}>
                            <motion.div
                                style={{
                                    height: '100%', borderRadius: 1,
                                    background: 'var(--accent)',
                                    scaleX: scrollYProgress,
                                    transformOrigin: 'left',
                                }}
                            />
                        </motion.div>
                    </div>
                )}
            </div>
        </section>
    );
}
