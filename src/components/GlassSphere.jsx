'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ── Mouse parallax rig ──────────────────────────── */
function ParallaxRig({ mousePos }) {
    const { camera } = useThree();
    const target = useRef(new THREE.Vector3(0, 0, 6));

    useFrame(() => {
        const tx = mousePos.current.x * 0.4;
        const ty = mousePos.current.y * 0.3;
        target.current.set(tx, ty, 6);
        camera.position.lerp(target.current, 0.03);
        camera.lookAt(0, 0, 0);
    });

    return null;
}

/* ── Glass orb — reduced opacity, slower rotation ── */
function GlassOrb() {
    const meshRef = useRef();

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.08) * 0.12;
            meshRef.current.rotation.y = clock.elapsedTime * 0.04;
        }
    });

    return (
        <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.5}>
            {/* Outer shell — very subtle */}
            <mesh ref={meshRef} scale={2.6}>
                <icosahedronGeometry args={[1, 8]} />
                <MeshDistortMaterial
                    color="#4488ff"
                    transparent
                    opacity={0.07}
                    roughness={0.15}
                    metalness={0.6}
                    distort={0.18}
                    speed={1.2}
                    wireframe={false}
                />
            </mesh>
            {/* Wireframe — very faint */}
            <mesh scale={2.7}>
                <icosahedronGeometry args={[1, 3]} />
                <meshBasicMaterial
                    color="#2997ff"
                    transparent
                    opacity={0.035}
                    wireframe
                />
            </mesh>
            {/* Inner core */}
            <mesh scale={0.9}>
                <sphereGeometry args={[1, 32, 32]} />
                <MeshDistortMaterial
                    color="#6db8ff"
                    transparent
                    opacity={0.12}
                    roughness={0}
                    metalness={1}
                    distort={0.3}
                    speed={1.5}
                />
            </mesh>
        </Float>
    );
}

/* ── Particles — fewer, subtler ──────────────────── */
function Particles() {
    const count = 50;
    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            arr[i * 3] = (Math.random() - 0.5) * 14;
            arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 14;
        }
        return arr;
    }, []);

    const ref = useRef();

    useFrame(({ clock }) => {
        if (ref.current) {
            ref.current.rotation.y = clock.elapsedTime * 0.008;
            ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.02) * 0.05;
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.02}
                color="#2997ff"
                transparent
                opacity={0.25}
                sizeAttenuation
            />
        </points>
    );
}

/* ── Exported component ──────────────────────────── */
export default function GlassSphere() {
    const mousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            mousePos.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mousePos.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                filter: 'blur(1px)',
            }}
        >
            <Canvas
                camera={{ position: [0, 0, 6], fov: 45 }}
                style={{ pointerEvents: 'none' }}
                gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
                dpr={[1, 1.5]}
                frameloop="always"
            >
                <ambientLight intensity={0.25} />
                <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />
                <directionalLight position={[-5, -3, -5]} intensity={0.2} color="#2997ff" />
                <pointLight position={[0, 0, 3]} intensity={0.3} color="#a855f7" />
                <ParallaxRig mousePos={mousePos} />
                <GlassOrb />
                <Particles />
            </Canvas>
        </div>
    );
}
