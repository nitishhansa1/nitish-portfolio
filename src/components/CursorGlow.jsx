'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * CursorGlow — Enhanced cursor with:
 *  - Smooth-follow main glow dot
 *  - Trailing orbs that fade out
 *  - Click ripple expanding circles
 */
export default function CursorGlow() {
    const [pos, setPos] = useState({ x: -500, y: -500 });
    const trailRef = useRef([]);
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const ripplesRef = useRef([]);
    const isTouch = useRef(false);

    // Detect touch device
    useEffect(() => {
        isTouch.current = 'ontouchstart' in window;
    }, []);

    // Mouse tracking
    useEffect(() => {
        if (isTouch.current) return;
        const handleMouseMove = (e) => {
            setPos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Click ripple
    useEffect(() => {
        if (isTouch.current) return;
        const handleClick = (e) => {
            ripplesRef.current.push({
                x: e.clientX,
                y: e.clientY,
                radius: 0,
                opacity: 0.5,
                time: Date.now(),
            });
        };
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    // Canvas animation loop for trail + ripples
    useEffect(() => {
        if (isTouch.current) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const maxTrail = 12;
        let prevX = -500, prevY = -500;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update trail
            const { x, y } = pos;
            if (Math.abs(x - prevX) > 1 || Math.abs(y - prevY) > 1) {
                trailRef.current.push({ x, y, opacity: 0.4, size: 6 });
                if (trailRef.current.length > maxTrail) {
                    trailRef.current.shift();
                }
                prevX = x;
                prevY = y;
            }

            // Draw trail
            trailRef.current.forEach((dot, i) => {
                dot.opacity *= 0.9;
                dot.size *= 0.95;
                if (dot.opacity < 0.01) return;
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(41, 151, 255, ${dot.opacity})`;
                ctx.fill();
            });

            // Clean dead trail dots
            trailRef.current = trailRef.current.filter(d => d.opacity > 0.01);

            // Draw ripples
            const now = Date.now();
            ripplesRef.current.forEach((ripple) => {
                const age = now - ripple.time;
                ripple.radius = age * 0.3;
                ripple.opacity = Math.max(0, 0.4 - age * 0.001);

                if (ripple.opacity <= 0) return;

                ctx.beginPath();
                ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(41, 151, 255, ${ripple.opacity})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            });

            // Clean dead ripples
            ripplesRef.current = ripplesRef.current.filter(r => r.opacity > 0);

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener('resize', resize);
        };
    }, [pos]);

    if (typeof window !== 'undefined' && isTouch.current) return null;

    return (
        <>
            {/* Main glow dot */}
            <div
                className="cursor-glow"
                style={{ left: pos.x, top: pos.y }}
            />
            {/* Trail + ripple canvas */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    inset: 0,
                    pointerEvents: 'none',
                    zIndex: 9998,
                }}
            />
        </>
    );
}
