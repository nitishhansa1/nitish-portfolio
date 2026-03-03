'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { HiSun, HiMoon } from 'react-icons/hi';

const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
    const { isDark, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className={`fixed top-0 left-0 right-0 z-[10000] transition-all duration-500 ${scrolled ? 'liquid-glass' : ''
                }`}
            style={{
                padding: scrolled ? '12px 0' : '20px 0',
            }}
        >
            <div className="container-main flex items-center justify-between">
                {/* Logo */}
                <a
                    href="#hero"
                    className="text-lg font-bold tracking-tight"
                    style={{ color: 'var(--fg)', textDecoration: 'none' }}
                >
                    <span className="text-gradient">NH</span>
                    <span style={{ opacity: 0.5, fontWeight: 400, marginLeft: 4 }}>.</span>
                </a>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium transition-colors duration-300"
                            style={{
                                color: 'var(--fg-secondary)',
                                textDecoration: 'none',
                                letterSpacing: '-0.01em',
                            }}
                            onMouseEnter={(e) => (e.target.style.color = 'var(--fg)')}
                            onMouseLeave={(e) => (e.target.style.color = 'var(--fg-secondary)')}
                        >
                            {link.name}
                        </a>
                    ))}

                    {/* Theme toggle — liquid glass */}
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center rounded-full transition-all duration-300"
                        style={{
                            width: 36,
                            height: 36,
                            background: 'var(--liquid-bg)',
                            border: '1px solid var(--liquid-border)',
                            backdropFilter: 'blur(20px) saturate(150%)',
                            WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                            color: 'var(--fg)',
                            cursor: 'pointer',
                            boxShadow: 'inset 0 1px 0 var(--liquid-inner-glow)',
                        }}
                        aria-label="Toggle theme"
                    >
                        {isDark ? <HiSun size={16} /> : <HiMoon size={16} />}
                    </button>
                </div>

                {/* Mobile menu button */}
                <div className="flex items-center gap-3 md:hidden">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center rounded-full"
                        style={{
                            width: 36,
                            height: 36,
                            background: 'var(--liquid-bg)',
                            border: '1px solid var(--liquid-border)',
                            backdropFilter: 'blur(20px) saturate(150%)',
                            WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                            color: 'var(--fg)',
                            cursor: 'pointer',
                            boxShadow: 'inset 0 1px 0 var(--liquid-inner-glow)',
                        }}
                        aria-label="Toggle theme"
                    >
                        {isDark ? <HiSun size={16} /> : <HiMoon size={16} />}
                    </button>
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="flex flex-col gap-1.5 items-center justify-center"
                        style={{ width: 36, height: 36, cursor: 'pointer', background: 'none', border: 'none' }}
                        aria-label="Toggle menu"
                    >
                        <span
                            style={{
                                width: 18,
                                height: 1.5,
                                background: 'var(--fg)',
                                borderRadius: 2,
                                transition: 'all 0.3s',
                                transform: mobileOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none',
                            }}
                        />
                        <span
                            style={{
                                width: 18,
                                height: 1.5,
                                background: 'var(--fg)',
                                borderRadius: 2,
                                transition: 'all 0.3s',
                                opacity: mobileOpen ? 0 : 1,
                            }}
                        />
                        <span
                            style={{
                                width: 18,
                                height: 1.5,
                                background: 'var(--fg)',
                                borderRadius: 2,
                                transition: 'all 0.3s',
                                transform: mobileOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'none',
                            }}
                        />
                    </button>
                </div>
            </div>

            {/* Mobile menu — liquid glass */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="md:hidden liquid-glass"
                        style={{ marginTop: 12, borderRadius: 20, marginLeft: 24, marginRight: 24, overflow: 'hidden' }}
                    >
                        <div className="flex flex-col gap-1 p-4">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.4,
                                        delay: i * 0.06,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                    className="text-sm font-medium py-3 px-4 rounded-xl"
                                    style={{
                                        color: 'var(--fg-secondary)',
                                        textDecoration: 'none',
                                        transition: 'background 0.3s ease, color 0.3s ease',
                                    }}
                                    whileHover={{
                                        backgroundColor: 'var(--liquid-bg)',
                                        color: 'var(--fg)',
                                    }}
                                >
                                    {link.name}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
