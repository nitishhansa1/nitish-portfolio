'use client';

import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaHeart } from 'react-icons/fa';
import { HiArrowUp } from 'react-icons/hi';

const socials = [
    { icon: FaGithub, href: 'https://github.com', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
];

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer
            style={{
                padding: '3rem 0 2rem',
                borderTop: '1px solid var(--liquid-border)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Subtle gradient glow at top of footer */}
            <div
                style={{
                    position: 'absolute',
                    top: -1,
                    left: '20%',
                    width: '60%',
                    height: 1,
                    background: 'linear-gradient(90deg, transparent, var(--accent), #a855f7, transparent)',
                    opacity: 0.5,
                }}
            />

            <div className="container-main">
                <div
                    className="flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-2"
                    >
                        <span
                            style={{
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, var(--accent), #a855f7)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            NH
                        </span>
                        <span style={{ color: 'var(--fg-secondary)', fontSize: '0.8rem' }}>
                            •
                        </span>
                        <span style={{ color: 'var(--fg-secondary)', fontSize: '0.8rem' }}>
                            © {new Date().getFullYear()}
                        </span>
                    </motion.div>

                    {/* Social links */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex gap-4"
                    >
                        {socials.map((social) => (
                            <motion.a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ y: -3, color: 'var(--accent)' }}
                                whileTap={{ scale: 0.9 }}
                                style={{
                                    color: 'var(--fg-secondary)',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s',
                                }}
                                aria-label={social.label}
                            >
                                <social.icon size={18} />
                            </motion.a>
                        ))}
                    </motion.div>

                    {/* Built with love + scroll to top */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex items-center gap-4"
                    >
                        <p
                            className="flex items-center gap-1"
                            style={{
                                fontSize: '0.8rem',
                                color: 'var(--fg-secondary)',
                            }}
                        >
                            Built with
                            <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                style={{ color: '#ec4899', display: 'inline-flex' }}
                            >
                                <FaHeart size={12} />
                            </motion.span>
                            & precision
                        </p>

                        {/* Back to top */}
                        <motion.button
                            onClick={scrollToTop}
                            whileHover={{
                                y: -3,
                                boxShadow: '0 0 20px rgba(41,151,255,0.15)',
                            }}
                            whileTap={{ scale: 0.9 }}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 12,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'var(--liquid-bg)',
                                border: '1px solid var(--liquid-border)',
                                backdropFilter: 'blur(12px)',
                                color: 'var(--fg-secondary)',
                                cursor: 'pointer',
                                transition: 'color 0.2s, border-color 0.2s',
                            }}
                            aria-label="Back to top"
                        >
                            <HiArrowUp size={16} />
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </footer>
    );
}
