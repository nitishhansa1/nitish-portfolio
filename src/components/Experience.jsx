'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import LiquidGlassCard from './LiquidGlassCard';
import TextReveal from './TextReveal';
import FloatingDepthLayer from './FloatingDepthLayer';

const EASE_PREMIUM = [0.22, 1, 0.36, 1];

const experiences = [
    {
        year: '2024 — Present', role: 'AI Engineer', company: 'Freelance / Open Source',
        description: 'Building intelligent systems with LLMs, computer vision, and full-stack web. Shipped 8+ AI models and contributed to open-source ML libraries.',
        tech: ['Python', 'PyTorch', 'LangChain', 'Next.js'], color: '#2997ff', icon: '🚀',
    },
    {
        year: '2023 — 2024', role: 'Full Stack Developer', company: 'Tech Startup',
        description: 'Led frontend architecture using React and Next.js. Built real-time dashboards, automated CI/CD pipelines, and mentored junior developers.',
        tech: ['React', 'Node.js', 'PostgreSQL', 'Docker'], color: '#a855f7', icon: '💻',
    },
    {
        year: '2022 — 2023', role: 'ML Research Intern', company: 'AI Research Lab',
        description: 'Researched neural architecture search and developed novel attention mechanisms for NLP tasks. Published findings at peer-reviewed workshops.',
        tech: ['TensorFlow', 'Python', 'CUDA', 'LaTeX'], color: '#ec4899', icon: '🔬',
    },
    {
        year: '2020 — 2022', role: 'Computer Science Student', company: 'University',
        description: 'Graduated with honors. Built 15+ projects spanning web development, mobile apps, and machine learning. Won 3 hackathons.',
        tech: ['Java', 'Python', 'JavaScript', 'C++'], color: '#34d399', icon: '🎓',
    },
];

function TimelineItem({ exp, index, isLast }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <div ref={ref} style={{ position: 'relative', paddingLeft: 60, paddingBottom: isLast ? 0 : 60 }}>
            {!isLast && (
                <motion.div
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{
                        position: 'absolute', left: 19, top: 44, width: 2,
                        height: 'calc(100% - 44px)',
                        background: `linear-gradient(to bottom, ${exp.color}, transparent)`,
                        transformOrigin: 'top', opacity: 0.3,
                    }}
                />
            )}

            <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 200 }}
                style={{
                    position: 'absolute', left: 8, top: 8, width: 24, height: 24,
                    borderRadius: '50%', background: 'var(--liquid-bg)',
                    border: `2px solid ${exp.color}`, backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', boxShadow: `0 0 20px ${exp.color}30`, zIndex: 2,
                }}
            >
                <motion.div
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    style={{ width: 8, height: 8, borderRadius: '50%', background: exp.color }}
                />
            </motion.div>

            {/* Card — subtle entry only (30px max), no continuous drift */}
            <LiquidGlassCard
                tilt
                padding="1.5rem 2rem"
                motionProps={{
                    initial: { opacity: 0, y: 20 },
                    animate: isInView ? { opacity: 1, y: 0 } : {},
                    transition: { duration: 0.7, delay: 0.15, ease: EASE_PREMIUM },
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: '1.2rem' }}>{exp.icon}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: exp.color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {exp.year}
                    </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--fg)', marginBottom: 2 }}>{exp.role}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--fg-secondary)', marginBottom: 10, fontWeight: 500 }}>{exp.company}</p>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--fg-secondary)', marginBottom: 12 }}>{exp.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {exp.tech.map((t) => (
                        <motion.span key={t} whileHover={{ scale: 1.1, y: -2 }}
                            style={{
                                padding: '3px 10px', borderRadius: 980, fontSize: '0.65rem',
                                fontWeight: 600, color: exp.color,
                                background: `${exp.color}10`, border: `1px solid ${exp.color}25`, cursor: 'default',
                            }}
                        >
                            {t}
                        </motion.span>
                    ))}
                </div>
            </LiquidGlassCard>
        </div>
    );
}

export default function Experience() {
    return (
        <section id="experience" style={{ padding: 'var(--section-gap) 0', position: 'relative' }}>
            <FloatingDepthLayer sectionId="about" />
            <div className="container-main">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="section-label">Experience</p>
                    <TextReveal as="h2" className="section-title" delay={0.1} staggerDelay={0.08}>
                        My journey so far
                    </TextReveal>
                </motion.div>

                <div style={{ maxWidth: 650, marginTop: '3rem' }}>
                    {experiences.map((exp, i) => (
                        <TimelineItem key={exp.year} exp={exp} index={i} isLast={i === experiences.length - 1} />
                    ))}
                </div>
            </div>
        </section>
    );
}
