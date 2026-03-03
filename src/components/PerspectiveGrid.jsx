'use client';

import { useRef, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

/**
 * PerspectiveGrid — A subtle 3D vanishing point grid that gives the page
 * a sense of spatial depth. Drawn on canvas for performance.
 */
export default function PerspectiveGrid() {
    const canvasRef = useRef(null);
    const { isDark } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            draw();
        };

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const vanishY = canvas.height * 0.35;
            const lineColor = isDark
                ? 'rgba(41, 151, 255, 0.04)'
                : 'rgba(41, 151, 255, 0.025)';
            const lineColorH = isDark
                ? 'rgba(168, 85, 247, 0.03)'
                : 'rgba(168, 85, 247, 0.02)';

            // Vertical perspective lines from vanishing point
            const numLines = 16;
            for (let i = 0; i <= numLines; i++) {
                const ratio = i / numLines;
                const x = ratio * canvas.width;
                ctx.beginPath();
                ctx.moveTo(cx, vanishY);
                ctx.lineTo(x, canvas.height);
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }

            // Horizontal lines with increasing spacing (perspective)
            const numH = 12;
            for (let i = 1; i <= numH; i++) {
                const t = i / numH;
                const y = vanishY + (canvas.height - vanishY) * (t * t); // quadratic for perspective
                const spread = (y - vanishY) / (canvas.height - vanishY);
                const leftX = cx - (cx * spread * 1.5);
                const rightX = cx + (cx * spread * 1.5);
                ctx.beginPath();
                ctx.moveTo(Math.max(0, leftX), y);
                ctx.lineTo(Math.min(canvas.width, rightX), y);
                ctx.strokeStyle = lineColorH;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }

        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, [isDark]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 0.6,
            }}
        />
    );
}
