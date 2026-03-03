'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import MagneticButton from '@/components/MagneticButton';
import FloatingDepthLayer from '@/components/FloatingDepthLayer';
import MorphingText from '@/components/MorphingText';

const EASE_PREMIUM = [0.22, 1, 0.36, 1];

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0B0F14] text-white flex flex-col items-center justify-center relative overflow-hidden">
            <FloatingDepthLayer sectionId="404" />

            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE_PREMIUM }}
                className="relative z-10 text-center flex flex-col items-center"
            >
                <motion.h1
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.2, ease: EASE_PREMIUM }}
                    className="text-[12rem] md:text-[18rem] font-bold leading-none tracking-tighter"
                    style={{
                        background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        opacity: 0.1,
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: -1
                    }}
                >
                    404
                </motion.h1>

                <p className="text-sm uppercase tracking-[0.3em] text-blue-400 font-semibold mb-6">
                    System Alert
                </p>

                <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">
                    Page Not Found
                </h2>

                <div className="text-lg text-white/60 mb-10 flex items-center justify-center gap-2">
                    <p>The signal is</p>
                    <MorphingText
                        texts={['Lost', 'Broken', 'Disconnected', 'Missing']}
                        interval={2000}
                        style={{ color: '#60A5FA', fontWeight: 600 }}
                    />
                </div>

                <MagneticButton className="btn-hero-primary" style={{ padding: '16px 40px' }}>
                    <Link href="/">
                        Return to Base
                    </Link>
                </MagneticButton>
            </motion.div>
        </div>
    );
}
