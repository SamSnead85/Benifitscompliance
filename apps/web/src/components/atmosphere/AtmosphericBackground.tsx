'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

interface AtmosphericBackgroundProps {
    className?: string;
    variant?: 'default' | 'intense' | 'subtle';
    showGrid?: boolean;
    showOrbs?: boolean;
    showNoise?: boolean;
}

/**
 * Premium Deep Noir Atmospheric Background
 * 5-Layer Environment for Executive-Grade Interfaces
 */
export function AtmosphericBackground({
    className = '',
    variant = 'default',
    showGrid = true,
    showOrbs = true,
    showNoise = true,
}: AtmosphericBackgroundProps) {
    const orbOpacity = variant === 'intense' ? 0.15 : variant === 'subtle' ? 0.05 : 0.08;

    return (
        <div className={`fixed inset-0 -z-10 overflow-hidden pointer-events-none ${className}`}>
            {/* Layer 1: Base Gradient Foundation */}
            <div
                className="absolute inset-0"
                style={{
                    background: `
            radial-gradient(ellipse 100% 80% at 50% -20%, rgba(6, 182, 212, ${orbOpacity}), transparent 50%),
            radial-gradient(ellipse 80% 60% at 100% 100%, rgba(6, 182, 212, ${orbOpacity * 0.5}), transparent 40%),
            radial-gradient(ellipse 60% 40% at 0% 80%, rgba(99, 102, 241, ${orbOpacity * 0.3}), transparent 30%),
            linear-gradient(180deg, #030712 0%, #050508 30%, #0A0A0F 70%, #030712 100%)
          `,
                }}
            />

            {/* Layer 2: Floating Orbs */}
            {showOrbs && (
                <>
                    <motion.div
                        className="absolute w-[800px] h-[800px] rounded-full"
                        style={{
                            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
                            filter: 'blur(60px)',
                            top: '-20%',
                            left: '10%',
                        }}
                        animate={{
                            x: [0, 100, 0],
                            y: [0, 50, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 30,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                    <motion.div
                        className="absolute w-[600px] h-[600px] rounded-full"
                        style={{
                            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)',
                            filter: 'blur(80px)',
                            bottom: '-10%',
                            right: '5%',
                        }}
                        animate={{
                            x: [0, -80, 0],
                            y: [0, -60, 0],
                            scale: [1, 1.15, 1],
                        }}
                        transition={{
                            duration: 35,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                    <motion.div
                        className="absolute w-[400px] h-[400px] rounded-full"
                        style={{
                            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.05) 0%, transparent 70%)',
                            filter: 'blur(50px)',
                            top: '40%',
                            right: '30%',
                        }}
                        animate={{
                            x: [0, 60, -40, 0],
                            y: [0, -40, 60, 0],
                        }}
                        transition={{
                            duration: 45,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                </>
            )}

            {/* Layer 3: Kinetic Grid */}
            {showGrid && (
                <motion.div
                    className="absolute inset-[-100%]"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.025) 1px, transparent 1px)
            `,
                        backgroundSize: '80px 80px',
                    }}
                    animate={{
                        x: [0, 80],
                        y: [0, 80],
                    }}
                    transition={{
                        duration: 120,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            )}

            {/* Layer 4: Radial Vignette */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(3, 7, 18, 0.5) 100%)',
                }}
            />

            {/* Layer 5: Noise Texture */}
            {showNoise && (
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                />
            )}
        </div>
    );
}

/**
 * Animated Counter for Executive Metrics
 */
interface AnimatedCounterProps {
    value: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    className?: string;
}

export function AnimatedCounter({
    value,
    duration = 2,
    prefix = '',
    suffix = '',
    decimals = 0,
    className = '',
}: AnimatedCounterProps) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => {
        const formatted = latest.toFixed(decimals);
        return `${prefix}${formatted}${suffix}`;
    });

    useEffect(() => {
        const controls = animate(count, value, { duration, ease: 'easeOut' });
        return controls.stop;
    }, [count, value, duration]);

    return (
        <motion.span className={className}>
            {rounded}
        </motion.span>
    );
}

/**
 * Premium Pulse Ring Animation
 */
interface PulseRingProps {
    color?: string;
    size?: number;
    className?: string;
}

export function PulseRing({
    color = 'rgba(6, 182, 212, 0.3)',
    size = 200,
    className = '',
}: PulseRingProps) {
    return (
        <div className={`relative ${className}`} style={{ width: size, height: size }}>
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full"
                    style={{
                        border: `1px solid ${color}`,
                    }}
                    animate={{
                        scale: [1, 2.5],
                        opacity: [0.6, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 1,
                        ease: 'easeOut',
                    }}
                />
            ))}
            <div
                className="absolute inset-0 rounded-full"
                style={{
                    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                }}
            />
        </div>
    );
}

export default AtmosphericBackground;
