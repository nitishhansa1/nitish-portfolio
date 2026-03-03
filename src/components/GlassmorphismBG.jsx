'use client';

import { useTheme } from '@/context/ThemeContext';

/**
 * GlassmorphismBG — Multi-depth colorful gradient orbs.
 * Orbs at different depths have different blur levels and sizes,
 * creating a layered sense of spatial depth behind all content.
 */
export default function GlassmorphismBG() {
    const { isDark } = useTheme();

    /* Accent colours tuned per theme */
    const blue = isDark ? 'rgba(41,151,255,0.18)' : 'rgba(41,151,255,0.14)';
    const purple = isDark ? 'rgba(168,85,247,0.15)' : 'rgba(168,85,247,0.1)';
    const pink = isDark ? 'rgba(236,72,153,0.12)' : 'rgba(236,72,153,0.08)';
    const teal = isDark ? 'rgba(52,211,153,0.12)' : 'rgba(52,211,153,0.08)';

    // depth: 'far' | 'mid' | 'near' — controls blur, speed, and visual weight
    const orbs = [
        /* ── Far depth (very blurry, large, slow) ── */
        { top: '3%', left: '-12%', w: 800, h: 800, color: blue, delay: 0, depth: 'far' },
        { top: '40%', right: '-10%', w: 750, h: 750, color: purple, delay: 2, depth: 'far' },
        { top: '75%', left: '-8%', w: 700, h: 700, color: teal, delay: 1, depth: 'far' },

        /* ── Mid depth (moderate blur, medium) ── */
        { top: '12%', right: '-5%', w: 500, h: 500, color: purple, delay: 2, depth: 'mid' },
        { top: '22%', left: '5%', w: 600, h: 600, color: pink, delay: 1, depth: 'mid' },
        { top: '48%', right: '-8%', w: 600, h: 600, color: teal, delay: 2, depth: 'mid' },
        { top: '62%', left: '10%', w: 550, h: 550, color: blue, delay: 1, depth: 'mid' },
        { top: '82%', left: '-3%', w: 600, h: 600, color: teal, delay: 0, depth: 'mid' },
        { top: '88%', right: '-5%', w: 520, h: 520, color: purple, delay: 2, depth: 'mid' },

        /* ── Near depth (crisp, small, fast) ── */
        { top: '8%', left: '30%', w: 300, h: 300, color: pink, delay: 0, depth: 'near' },
        { top: '35%', right: '20%', w: 250, h: 250, color: blue, delay: 3, depth: 'near' },
        { top: '55%', left: '40%', w: 200, h: 200, color: purple, delay: 1, depth: 'near' },
        { top: '70%', right: '30%', w: 280, h: 280, color: teal, delay: 2, depth: 'near' },
    ];

    const depthConfig = {
        far: { blur: 100, speed: 20, opacity: 0.6 },
        mid: { blur: 60, speed: 14, opacity: 0.8 },
        near: { blur: 30, speed: 10, opacity: 0.5 },
    };

    return (
        <div
            aria-hidden="true"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
                overflow: 'hidden',
            }}
        >
            {orbs.map((orb, i) => {
                const posStyle = {};
                posStyle.top = orb.top;
                if (orb.left !== undefined) posStyle.left = orb.left;
                if (orb.right !== undefined) posStyle.right = orb.right;

                const cfg = depthConfig[orb.depth];

                return (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            ...posStyle,
                            width: orb.w,
                            height: orb.h,
                            borderRadius: '50%',
                            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
                            filter: `blur(${cfg.blur}px)`,
                            opacity: cfg.opacity,
                            animation: `glassmorphOrb ${cfg.speed + i * 0.8}s ease-in-out ${orb.delay}s infinite`,
                        }}
                    />
                );
            })}

            <style>{`
                @keyframes glassmorphOrb {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25%  { transform: translate(25px, -15px) scale(1.04); }
                    50%  { transform: translate(-15px, 20px) scale(0.96); }
                    75%  { transform: translate(10px, -10px) scale(1.02); }
                }
            `}</style>
        </div>
    );
}
