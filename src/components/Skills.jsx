'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import LiquidGlassCard from './LiquidGlassCard';
import TextReveal from './TextReveal';
import ScrollVelocity from './ScrollVelocity';
import FloatingDepthLayer from './FloatingDepthLayer';

const EASE_PREMIUM = [0.22, 1, 0.36, 1];

const categories = [
    {
        name: 'Frontend', icon: '🎨',
        skills: [
            { name: 'React / Next.js', level: 95 }, { name: 'TypeScript', level: 90 },
            { name: 'Three.js / WebGL', level: 80 }, { name: 'CSS / Tailwind', level: 92 },
        ],
    },
    {
        name: 'Backend', icon: '⚙️',
        skills: [
            { name: 'Node.js / Express', level: 88 }, { name: 'Python / FastAPI', level: 92 },
            { name: 'GraphQL', level: 82 }, { name: 'PostgreSQL / MongoDB', level: 85 },
        ],
    },
    {
        name: 'AI / ML', icon: '🧠',
        skills: [
            { name: 'TensorFlow / PyTorch', level: 90 }, { name: 'NLP / Transformers', level: 87 },
            { name: 'Computer Vision', level: 83 }, { name: 'MLOps', level: 78 },
        ],
    },
    {
        name: 'Cloud / DevOps', icon: '☁️',
        skills: [
            { name: 'AWS / GCP', level: 85 }, { name: 'Docker / Kubernetes', level: 82 },
            { name: 'CI/CD', level: 88 }, { name: 'Terraform', level: 75 },
        ],
    },
];

function AnimatedPercent({ value, isInView }) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const step = value / (1.2 * 60);
        const interval = setInterval(() => {
            start += step;
            if (start >= value) { setCount(value); clearInterval(interval); }
            else { setCount(Math.floor(start)); }
        }, 1000 / 60);
        return () => clearInterval(interval);
    }, [isInView, value]);
    return <span>{count}%</span>;
}

function SkillBar({ skill, delay, isInView }) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <motion.div
            style={{ marginBottom: '1.2rem', cursor: 'default' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay, ease: EASE_PREMIUM }}
        >
            <div className="flex justify-between mb-2">
                <motion.span
                    animate={{ color: isHovered ? 'var(--accent)' : 'var(--fg)', x: isHovered ? 3 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ fontSize: '0.85rem', fontWeight: 500 }}
                >
                    {skill.name}
                </motion.span>
                <motion.span
                    animate={{ scale: isHovered ? 1.1 : 1, color: isHovered ? 'var(--accent)' : 'var(--fg-secondary)' }}
                    transition={{ duration: 0.2 }}
                    style={{ fontSize: '0.8rem', fontWeight: 600 }}
                >
                    <AnimatedPercent value={skill.level} isInView={isInView} />
                </motion.span>
            </div>
            <div style={{
                width: '100%', height: isHovered ? 8 : 4, borderRadius: 4,
                background: 'var(--liquid-bg)', overflow: 'hidden',
                border: '1px solid var(--liquid-border)', transition: 'height 0.3s ease',
            }}>
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay, ease: EASE_PREMIUM }}
                    style={{
                        height: '100%', borderRadius: 4,
                        background: isHovered
                            ? 'linear-gradient(90deg, var(--accent), #a855f7, #ec4899)'
                            : 'linear-gradient(90deg, var(--accent), #a855f7)',
                        boxShadow: isHovered
                            ? '0 0 20px rgba(41,151,255,0.5), 0 0 40px rgba(168,85,247,0.2)'
                            : '0 0 12px rgba(41,151,255,0.3)',
                        transition: 'background 0.3s ease, box-shadow 0.3s ease',
                    }}
                />
            </div>
        </motion.div>
    );
}

export default function Skills() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

    return (
        <section id="skills" ref={sectionRef} style={{ padding: 'var(--section-gap) 0', position: 'relative' }}>
            <FloatingDepthLayer sectionId="skills" />
            <div className="container-main">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="section-label">Skills</p>
                    <TextReveal as="h2" className="section-title" delay={0.1} staggerDelay={0.08}>
                        Technical expertise
                    </TextReveal>
                    <p style={{ color: 'var(--fg-secondary)', fontSize: '1rem', maxWidth: 500, marginBottom: '0.5rem' }}>
                        Hover over the bars to see them react. Click a category to expand.
                    </p>
                </motion.div>

                <ScrollVelocity effect="skew" intensity={0.2}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                        {categories.map((category, catIndex) => (
                            <LiquidGlassCard
                                key={category.name}
                                tilt
                                padding="2rem"
                                motionProps={{
                                    initial: { opacity: 0, y: 30 },
                                    whileInView: { opacity: 1, y: 0 },
                                    viewport: { once: true, margin: '-60px' },
                                    transition: { duration: 0.7, delay: catIndex * 0.1, ease: EASE_PREMIUM },
                                }}
                                style={{ cursor: 'default' }}
                            >
                                <motion.h3
                                    style={{
                                        fontSize: '1.1rem', fontWeight: 600, letterSpacing: '-0.02em',
                                        marginBottom: '1.5rem', display: 'flex', alignItems: 'center',
                                        gap: '0.6rem', color: 'var(--fg)',
                                    }}
                                    whileHover={{ x: 4 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <span style={{ fontSize: '1.3rem' }}>{category.icon}</span>
                                    {category.name}
                                    <motion.span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 500 }}>
                                        {category.skills.length} skills
                                    </motion.span>
                                </motion.h3>
                                {category.skills.map((skill, skillIndex) => (
                                    <SkillBar key={skill.name} skill={skill} delay={catIndex * 0.08 + skillIndex * 0.06} isInView={isInView} />
                                ))}
                                <motion.div
                                    style={{ marginTop: '0.5rem', height: 2, borderRadius: 1, background: 'linear-gradient(90deg, var(--accent), transparent)', transformOrigin: 'left' }}
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: catIndex * 0.12 + 0.4 }}
                                />
                            </LiquidGlassCard>
                        ))}
                    </div>
                </ScrollVelocity>
            </div>
        </section>
    );
}
