'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@/context/ThemeContext';

/*
  Neural Particle Field — Canvas-based for 60fps.
  - Glowing nodes at 3 depth layers
  - Thin connecting lines between nearby nodes
  - Slow ambient floating motion
  - Mouse parallax + proximity-reactive connections
  - Theme-aware (dark / light mode)
*/

const CONFIG = {
    nodeCount: 35,
    connectionDistance: 180,
    mouseRadius: 220,
    baseDrift: 0.15,            // ambient speed
    mouseInfluence: 0.03,       // parallax strength
    lineOpacityBase: 0.06,
    lineOpacityMouse: 0.18,     // brighter near cursor
    nodeGlowRadius: 12,
};

function createNodes(width, height) {
    const nodes = [];
    for (let i = 0; i < CONFIG.nodeCount; i++) {
        const depth = Math.random() < 0.3 ? 1 : Math.random() < 0.6 ? 2 : 3;
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            baseX: Math.random() * width,
            baseY: Math.random() * height,
            vx: (Math.random() - 0.5) * CONFIG.baseDrift,
            vy: (Math.random() - 0.5) * CONFIG.baseDrift,
            size: depth === 1 ? 2.5 : depth === 2 ? 1.8 : 1.2,
            depth,
            phase: Math.random() * Math.PI * 2,
            speed: 0.2 + Math.random() * 0.3,
        });
    }
    return nodes;
}

export default function FloatingParticles() {
    const canvasRef = useRef(null);
    const nodesRef = useRef([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const animRef = useRef(null);
    const { isDark } = useTheme();
    const isDarkRef = useRef(isDark);
    isDarkRef.current = isDark;

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const dark = isDarkRef.current;
        const nodes = nodesRef.current;
        const mouse = mouseRef.current;
        const time = performance.now() * 0.001;

        ctx.clearRect(0, 0, w, h);

        // ── Update node positions (slow drift + sine wave) ──
        for (const node of nodes) {
            const parallax = node.depth === 1 ? 1 : node.depth === 2 ? 0.6 : 0.3;
            const sinX = Math.sin(time * node.speed + node.phase) * 15 * parallax;
            const sinY = Math.cos(time * node.speed * 0.7 + node.phase) * 10 * parallax;

            // Mouse parallax push
            const mx = (mouse.x / w - 0.5) * 2;
            const my = (mouse.y / h - 0.5) * 2;
            const pushX = mx * 20 * parallax * CONFIG.mouseInfluence * w * 0.01;
            const pushY = my * 15 * parallax * CONFIG.mouseInfluence * h * 0.01;

            node.x = node.baseX + sinX + pushX;
            node.y = node.baseY + sinY + pushY;

            // Wrap
            node.baseX += node.vx;
            node.baseY += node.vy;
            if (node.baseX < -30) node.baseX = w + 30;
            if (node.baseX > w + 30) node.baseX = -30;
            if (node.baseY < -30) node.baseY = h + 30;
            if (node.baseY > h + 30) node.baseY = -30;
        }

        // ── Draw connections ──
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i];
                const b = nodes[j];
                // Only connect same or adjacent depth
                if (Math.abs(a.depth - b.depth) > 1) continue;

                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONFIG.connectionDistance) {
                    // Check mouse proximity to midpoint
                    const midX = (a.x + b.x) / 2;
                    const midY = (a.y + b.y) / 2;
                    const mDist = Math.sqrt((mouse.x - midX) ** 2 + (mouse.y - midY) ** 2);
                    const mouseFactor = Math.max(0, 1 - mDist / CONFIG.mouseRadius);

                    const fadeBase = 1 - dist / CONFIG.connectionDistance;
                    const opacity = fadeBase * (CONFIG.lineOpacityBase + mouseFactor * CONFIG.lineOpacityMouse);

                    // Depth-based blur via alpha
                    const depthAlpha = Math.max(a.depth, b.depth) === 3 ? 0.5 : Math.max(a.depth, b.depth) === 2 ? 0.7 : 1;

                    const blueR = dark ? 41 : 41;
                    const blueG = dark ? 151 : 121;
                    const blueB = 255;

                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(${blueR},${blueG},${blueB},${opacity * depthAlpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        // ── Draw nodes ──
        for (const node of nodes) {
            const depthAlpha = node.depth === 1 ? 1 : node.depth === 2 ? 0.65 : 0.35;

            // Check mouse proximity for glow boost
            const mDist = Math.sqrt((mouse.x - node.x) ** 2 + (mouse.y - node.y) ** 2);
            const mouseFactor = Math.max(0, 1 - mDist / CONFIG.mouseRadius);

            const baseOpacity = dark ? 0.5 : 0.55;
            const nodeOpacity = (baseOpacity + mouseFactor * 0.4) * depthAlpha;

            const blueR = dark ? 41 : 41;
            const blueG = dark ? 151 : 121;
            const blueB = 255;

            // Outer glow
            const glowSize = CONFIG.nodeGlowRadius * (1 + mouseFactor * 0.5);
            const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize);
            gradient.addColorStop(0, `rgba(${blueR},${blueG},${blueB},${nodeOpacity * 0.3})`);
            gradient.addColorStop(0.4, `rgba(${blueR},${blueG},${blueB},${nodeOpacity * 0.08})`);
            gradient.addColorStop(1, `rgba(${blueR},${blueG},${blueB},0)`);

            ctx.beginPath();
            ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Core dot
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${blueR},${blueG},${blueB},${nodeOpacity})`;
            ctx.fill();

            // Purple accent for depth-1 nodes
            if (node.depth === 1) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.size * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(168,85,247,${nodeOpacity * 0.5})`;
                ctx.fill();
            }
        }

        animRef.current = requestAnimationFrame(draw);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio, 2);
            canvas.width = canvas.offsetWidth * dpr;
            canvas.height = canvas.offsetHeight * dpr;
            const ctx = canvas.getContext('2d');
            ctx.scale(dpr, dpr);
            // Re-create nodes on resize
            nodesRef.current = createNodes(canvas.offsetWidth, canvas.offsetHeight);
        };

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mouseleave', handleMouseLeave);

        animRef.current = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [draw]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1,
            }}
        />
    );
}
