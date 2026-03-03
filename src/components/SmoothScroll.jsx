'use client';

import { ReactLenis } from '@studio-freight/react-lenis';

export default function SmoothScroll({ children }) {
    return (
        <ReactLenis
            root
            options={{
                lerp: 0.08, // The lower the lerp, the smoother/slower the scroll
                duration: 1.2,
                smoothWheel: true,
                wheelMultiplier: 1, // Determines scroll speed
                touchMultiplier: 2, // Helps with touch devices
                infinite: false,
            }}
        >
            {children}
        </ReactLenis>
    );
}
