'use client';

import { ReactLenis } from '@studio-freight/react-lenis';

export default function SmoothScroll({ children }) {
    return (
        <ReactLenis
            root
            options={{
                lerp: 0.1, // Fixed value for balanced scrolling, lower = smoother but can jitter if dropped frames occur
                duration: 1.2,
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                smoothTouch: false,
                wheelMultiplier: 1,
                touchMultiplier: 2,
                normalizeWheel: true,
                syncTouch: true, // Crucial for Framer Motion sync
            }}
        >
            {children}
        </ReactLenis>
    );
}
