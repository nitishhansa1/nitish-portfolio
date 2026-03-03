'use client';

import { useTheme } from '@/context/ThemeContext';

/**
 * SectionDivider — Animated wave/gradient divider between sections.
 *
 * Props:
 *  - variant: 'wave' | 'gradient' | 'dots' (default: 'wave')
 *  - flip: boolean, flip vertically (default: false)
 */
export default function SectionDivider({ variant = 'wave', flip = false }) {
    const { isDark } = useTheme();

    const baseColor = isDark ? '#000000' : '#ffffff';
    const accentColor = isDark ? 'rgba(41,151,255,0.06)' : 'rgba(41,151,255,0.04)';

    if (variant === 'gradient') {
        return (
            <div
                style={{
                    width: '100%',
                    height: 120,
                    background: `linear-gradient(180deg, transparent 0%, ${accentColor} 50%, transparent 100%)`,
                    transform: flip ? 'scaleY(-1)' : 'none',
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 60,
                        height: 2,
                        borderRadius: 1,
                        background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
                        opacity: 0.4,
                    }}
                />
            </div>
        );
    }

    if (variant === 'dots') {
        return (
            <div
                style={{
                    width: '100%',
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        style={{
                            width: i === 1 ? 6 : 4,
                            height: i === 1 ? 6 : 4,
                            borderRadius: '50%',
                            background: 'var(--accent)',
                            opacity: i === 1 ? 0.6 : 0.25,
                        }}
                    />
                ))}
            </div>
        );
    }

    // Default: wave
    return (
        <div
            style={{
                width: '100%',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 2,
                lineHeight: 0,
                transform: flip ? 'scaleY(-1)' : 'none',
            }}
        >
            <svg
                viewBox="0 0 1440 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '100%', height: 'auto', display: 'block' }}
                preserveAspectRatio="none"
            >
                <path
                    d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
                    fill={baseColor}
                    fillOpacity="0.04"
                />
                <path
                    d="M0,40 C320,65 640,15 960,40 C1120,55 1280,25 1440,40 L1440,60 L0,60 Z"
                    fill="url(#waveGrad)"
                    fillOpacity="0.07"
                />
                <defs>
                    <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="var(--accent)" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}
