'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import LiquidGlassCard from './LiquidGlassCard';
import TextReveal from './TextReveal';
import FloatingDepthLayer from './FloatingDepthLayer';

const EASE_PREMIUM = [0.22, 1, 0.36, 1];

const testimonials = [
    {
        name: 'Sarah Chen', role: 'CTO, TechVenture',
        text: "Nitish's AI solutions transformed our data pipeline. His ability to bridge ML research with production-ready code is exceptional.",
        avatar: '👩‍💼', color: '#2997ff',
    },
    {
        name: 'Alex Rivera', role: 'Product Lead, StartupX',
        text: 'One of the most creative developers I\'ve worked with. The interfaces he builds aren\'t just functional — they\'re works of art.',
        avatar: '👨‍💻', color: '#a855f7',
    },
    {
        name: 'Dr. Priya Sharma', role: 'ML Research Director',
        text: 'Nitish has a rare combination of deep technical knowledge and design sensibility. His research contributions were invaluable.',
        avatar: '👩‍🔬', color: '#ec4899',
    },
];

function TestimonialCard({ t, index }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: index * 0.12, ease: EASE_PREMIUM }}
            style={{ perspective: 800, willChange: 'transform, opacity' }}
        >
            <LiquidGlassCard tilt padding="2rem">
                <div style={{
                    fontSize: '2.5rem', lineHeight: 1, color: t.color,
                    opacity: 0.3, fontFamily: 'Georgia, serif', marginBottom: -8,
                }}>
                    &ldquo;
                </div>

                <p style={{
                    fontSize: '0.9rem', lineHeight: 1.7,
                    color: 'var(--fg-secondary)', marginBottom: 20, fontStyle: 'italic',
                }}>
                    {t.text}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 8 }}
                        style={{
                            width: 40, height: 40, borderRadius: '50%',
                            background: `${t.color}15`, border: `2px solid ${t.color}40`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.2rem',
                        }}
                    >
                        {t.avatar}
                    </motion.div>
                    <div>
                        <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--fg)' }}>{t.name}</p>
                        <p style={{ fontSize: '0.7rem', color: t.color, fontWeight: 500 }}>{t.role}</p>
                    </div>
                </div>

                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.12 }}
                    style={{
                        marginTop: 16, height: 2, borderRadius: 1,
                        background: `linear-gradient(90deg, ${t.color}, transparent)`,
                        transformOrigin: 'left', opacity: 0.3,
                    }}
                />
            </LiquidGlassCard>
        </motion.div>
    );
}

export default function Testimonials() {
    return (
        <section id="testimonials" style={{ padding: 'var(--section-gap) 0', position: 'relative' }}>
            <FloatingDepthLayer sectionId="skills" />
            <div className="container-main">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="section-label">Testimonials</p>
                    <TextReveal as="h2" className="section-title" delay={0.1} staggerDelay={0.08}>
                        What people say
                    </TextReveal>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    {testimonials.map((t, i) => (
                        <TestimonialCard key={t.name} t={t} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
