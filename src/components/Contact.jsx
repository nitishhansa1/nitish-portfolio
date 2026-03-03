'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { HiMail, HiLocationMarker, HiCheck } from 'react-icons/hi';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import LiquidGlassCard from './LiquidGlassCard';
import TextReveal from './TextReveal';
import FloatingDepthLayer from './FloatingDepthLayer';

const EASE_PREMIUM = [0.22, 1, 0.36, 1];

const socials = [
    { icon: FaGithub, href: 'https://github.com', label: 'GitHub', color: '#6e5494' },
    { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: '#0077b5' },
    { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter', color: '#1da1f2' },
];

function FloatingInput({ label, type = 'text', textarea = false }) {
    const [focused, setFocused] = useState(false);
    const [value, setValue] = useState('');
    const isActive = focused || value.length > 0;
    const Tag = textarea ? 'textarea' : 'input';

    return (
        <div style={{ position: 'relative' }}>
            <motion.label
                animate={{
                    top: isActive ? -8 : textarea ? 16 : '50%',
                    y: isActive ? 0 : textarea ? 0 : '-50%',
                    fontSize: isActive ? '0.7rem' : '0.9rem',
                    color: focused ? 'var(--accent)' : 'var(--fg-secondary)',
                    letterSpacing: isActive ? '0.1em' : '0',
                }}
                transition={{ duration: 0.25, ease: EASE_PREMIUM }}
                style={{
                    position: 'absolute', left: 20, fontWeight: 500,
                    textTransform: isActive ? 'uppercase' : 'none',
                    pointerEvents: 'none', zIndex: 2,
                    background: isActive ? 'var(--bg)' : 'transparent',
                    padding: isActive ? '0 6px' : 0,
                }}
            >
                {label}
            </motion.label>
            <Tag
                type={type} rows={textarea ? 5 : undefined}
                className="liquid-glass-input"
                style={textarea ? { resize: 'none' } : {}}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={(e) => setValue(e.target.value)}
                value={value}
            />
            <motion.div
                animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                style={{
                    position: 'absolute', bottom: 0, left: '10%', width: '80%',
                    height: 2, borderRadius: 1,
                    background: 'linear-gradient(90deg, var(--accent), #a855f7)',
                    transformOrigin: 'center',
                    boxShadow: '0 0 12px rgba(41,151,255,0.3)',
                }}
            />
        </div>
    );
}

function SocialIcon({ social }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div style={{ position: 'relative' }}>
            <AnimatePresence>
                {hovered && (
                    <motion.span
                        initial={{ opacity: 0, y: 8, scale: 0.8 }}
                        animate={{ opacity: 1, y: -8, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.8 }}
                        style={{
                            position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                            padding: '4px 10px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 600,
                            background: 'var(--liquid-bg)', border: '1px solid var(--liquid-border)',
                            backdropFilter: 'blur(12px)', color: 'var(--fg)',
                            whiteSpace: 'nowrap', pointerEvents: 'none',
                        }}
                    >
                        {social.label}
                    </motion.span>
                )}
            </AnimatePresence>
            <motion.a
                href={social.href} target="_blank" rel="noopener noreferrer"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                whileHover={{ scale: 1.15, borderColor: social.color, boxShadow: `0 0 20px ${social.color}30` }}
                whileTap={{ scale: 0.9 }}
                style={{
                    width: 52, height: 52, borderRadius: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--liquid-bg)', border: '1px solid var(--liquid-border)',
                    backdropFilter: 'blur(16px) saturate(150%)',
                    WebkitBackdropFilter: 'blur(16px) saturate(150%)',
                    color: hovered ? social.color : 'var(--fg)',
                    textDecoration: 'none', transition: 'color 0.3s, border-color 0.3s',
                    boxShadow: 'inset 0 1px 0 var(--liquid-inner-glow)',
                }}
                aria-label={social.label}
            >
                <social.icon size={22} />
            </motion.a>
        </div>
    );
}

export default function Contact() {
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    /* ── Soft diagonal entry (max 15px) ── */
    const formX = useTransform(scrollYProgress, [0.05, 0.28], [-15, 0]);
    const formY = useTransform(scrollYProgress, [0.05, 0.28], [15, 0]);
    const infoX = useTransform(scrollYProgress, [0.08, 0.32], [15, 0]);
    const infoY = useTransform(scrollYProgress, [0.08, 0.32], [15, 0]);
    const contentOpacity = useTransform(scrollYProgress, [0.05, 0.22], [0, 1]);

    /* ── Reduced hue shift (halved) ── */
    const hueRotate = useTransform(scrollYProgress, [0, 1], [0, 22]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSubmitted(true);
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setSubmitted(false), 3000);
            } else {
                setError('Failed to send message. Please try again later.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section ref={sectionRef} id="contact" style={{ padding: 'var(--section-gap) 0', paddingBottom: '8rem', position: 'relative' }}>
            <FloatingDepthLayer sectionId="contact" />

            {/* Ambient hue-shifting overlay (reduced) */}
            <motion.div
                style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
                    filter: useTransform(hueRotate, (v) => `hue-rotate(${v}deg)`),
                    background: 'radial-gradient(ellipse at 30% 50%, rgba(41,151,255,0.03) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(168,85,247,0.03) 0%, transparent 60%)',
                }}
            />

            <div className="container-main" style={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="section-label">Contact</p>
                    <TextReveal as="h2" className="section-title" delay={0.1} staggerDelay={0.08}>
                        Let&apos;s connect
                    </TextReveal>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mt-12">
                    {/* Form — gentle diagonal */}
                    <motion.div style={{ x: formX, y: formY, opacity: contentOpacity, willChange: 'transform, opacity' }}>
                        <LiquidGlassCard tilt padding="2rem 2.5rem">
                            <AnimatePresence mode="wait">
                                {submitted ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: '1rem' }}
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                                            style={{
                                                width: 64, height: 64, borderRadius: '50%',
                                                background: 'linear-gradient(135deg, var(--accent), #a855f7)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                boxShadow: '0 0 40px rgba(41,151,255,0.3)',
                                            }}
                                        >
                                            <HiCheck size={32} color="#fff" />
                                        </motion.div>
                                        <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--fg)' }}>Message Sent!</h3>
                                        <p style={{ color: 'var(--fg-secondary)', fontSize: '0.9rem' }}>I&apos;ll get back to you soon.</p>
                                    </motion.div>
                                ) : (
                                    <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        onSubmit={handleSubmit}
                                        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                                    >
                                        <div style={{ position: 'relative' }}>
                                            <motion.label
                                                animate={{
                                                    top: formData.name ? -8 : '50%',
                                                    y: formData.name ? 0 : '-50%',
                                                    fontSize: formData.name ? '0.7rem' : '0.9rem',
                                                    color: 'var(--fg-secondary)',
                                                    letterSpacing: formData.name ? '0.1em' : '0',
                                                }}
                                                transition={{ duration: 0.25, ease: EASE_PREMIUM }}
                                                style={{
                                                    position: 'absolute', left: 20, fontWeight: 500,
                                                    textTransform: formData.name ? 'uppercase' : 'none',
                                                    pointerEvents: 'none', zIndex: 2,
                                                    background: formData.name ? 'var(--bg)' : 'transparent',
                                                    padding: formData.name ? '0 6px' : 0,
                                                }}
                                            >
                                                Your Name
                                            </motion.label>
                                            <input
                                                type="text"
                                                required
                                                className="liquid-glass-input"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>

                                        <div style={{ position: 'relative' }}>
                                            <motion.label
                                                animate={{
                                                    top: formData.email ? -8 : '50%',
                                                    y: formData.email ? 0 : '-50%',
                                                    fontSize: formData.email ? '0.7rem' : '0.9rem',
                                                    color: 'var(--fg-secondary)',
                                                    letterSpacing: formData.email ? '0.1em' : '0',
                                                }}
                                                transition={{ duration: 0.25, ease: EASE_PREMIUM }}
                                                style={{
                                                    position: 'absolute', left: 20, fontWeight: 500,
                                                    textTransform: formData.email ? 'uppercase' : 'none',
                                                    pointerEvents: 'none', zIndex: 2,
                                                    background: formData.email ? 'var(--bg)' : 'transparent',
                                                    padding: formData.email ? '0 6px' : 0,
                                                }}
                                            >
                                                Email Address
                                            </motion.label>
                                            <input
                                                type="email"
                                                required
                                                className="liquid-glass-input"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>

                                        <div style={{ position: 'relative' }}>
                                            <motion.label
                                                animate={{
                                                    top: formData.message ? -8 : 16,
                                                    y: formData.message ? 0 : 0,
                                                    fontSize: formData.message ? '0.7rem' : '0.9rem',
                                                    color: 'var(--fg-secondary)',
                                                    letterSpacing: formData.message ? '0.1em' : '0',
                                                }}
                                                transition={{ duration: 0.25, ease: EASE_PREMIUM }}
                                                style={{
                                                    position: 'absolute', left: 20, fontWeight: 500,
                                                    textTransform: formData.message ? 'uppercase' : 'none',
                                                    pointerEvents: 'none', zIndex: 2,
                                                    background: formData.message ? 'var(--bg)' : 'transparent',
                                                    padding: formData.message ? '0 6px' : 0,
                                                }}
                                            >
                                                Your Message
                                            </motion.label>
                                            <textarea
                                                required
                                                rows={5}
                                                className="liquid-glass-input"
                                                style={{ resize: 'none' }}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            />
                                        </div>

                                        {error && (
                                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center' }}>
                                                {error}
                                            </motion.p>
                                        )}

                                        <motion.button type="submit" className="btn-primary"
                                            disabled={isLoading}
                                            whileHover={{ scale: isLoading ? 1 : 1.03, boxShadow: '0 0 30px rgba(41,151,255,0.2)' }}
                                            whileTap={{ scale: isLoading ? 1 : 0.97 }}
                                            style={{ width: '100%', justifyContent: 'center', marginTop: 8, position: 'relative', overflow: 'hidden', opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
                                        >
                                            <span style={{ position: 'relative', zIndex: 2 }}>{isLoading ? 'Sending...' : 'Send Message'}</span>
                                            {!isLoading && <motion.div
                                                style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}
                                                animate={{ x: ['-100%', '200%'] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                            />}
                                        </motion.button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </LiquidGlassCard>
                    </motion.div>

                    {/* Info — gentle diagonal from opposite side */}
                    <motion.div
                        style={{
                            x: infoX, y: infoY, opacity: contentOpacity, willChange: 'transform, opacity',
                            display: 'flex', flexDirection: 'column', gap: '2rem', justifyContent: 'center'
                        }}
                    >
                        <div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--fg)', marginBottom: '1rem' }}>
                                Get in touch
                            </h3>
                            <p style={{ color: 'var(--fg-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                                I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Feel free to reach out!
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { icon: HiMail, text: 'nitish@example.com' },
                                { icon: HiLocationMarker, text: 'India' },
                            ].map((item, i) => (
                                <motion.div key={i} className="flex items-center gap-3"
                                    whileHover={{ x: 6 }} transition={{ duration: 0.2 }}
                                    style={{ cursor: 'default' }}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.08, boxShadow: '0 0 16px rgba(41,151,255,0.15)' }}
                                        style={{
                                            width: 44, height: 44, borderRadius: 14,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: 'var(--liquid-bg)', border: '1px solid var(--liquid-border)',
                                            backdropFilter: 'blur(16px) saturate(150%)',
                                            color: 'var(--accent)', boxShadow: 'inset 0 1px 0 var(--liquid-inner-glow)',
                                        }}
                                    >
                                        <item.icon size={20} />
                                    </motion.div>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--fg-secondary)' }}>{item.text}</span>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            {socials.map((social, i) => (
                                <motion.div key={social.label}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + i * 0.08, ease: EASE_PREMIUM }}
                                >
                                    <SocialIcon social={social} />
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '8px 16px', borderRadius: 980,
                                background: 'var(--liquid-bg)', border: '1px solid var(--liquid-border)',
                                backdropFilter: 'blur(16px)', alignSelf: 'flex-start',
                            }}
                        >
                            <motion.span
                                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px rgba(52,211,153,0.5)' }}
                            />
                            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--fg-secondary)' }}>
                                Available for freelance work
                            </span>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
