'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';

/**
 * Hover Card
 * Enhanced hover effects for interactive elements
 */
interface HoverCardProps {
    children: ReactNode;
    hoverScale?: number;
    hoverY?: number;
    className?: string;
}

export function HoverCard({
    children,
    hoverScale = 1.02,
    hoverY = -2,
    className = ''
}: HoverCardProps) {
    return (
        <motion.div
            whileHover={{
                scale: hoverScale,
                y: hoverY,
                transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * Press Button Wrapper
 * Physics-based press animation
 */
interface PressWrapperProps {
    children: ReactNode;
    pressScale?: number;
    className?: string;
    onClick?: () => void;
}

export function PressWrapper({
    children,
    pressScale = 0.98,
    className = '',
    onClick
}: PressWrapperProps) {
    return (
        <motion.div
            whileTap={{
                scale: pressScale,
                transition: { duration: 0.1 }
            }}
            onClick={onClick}
            className={`cursor-pointer ${className}`}
        >
            {children}
        </motion.div>
    );
}

/**
 * Shimmer Effect
 * Subtle loading shimmer overlay
 */
interface ShimmerProps {
    width?: string;
    height?: string;
    className?: string;
}

export function Shimmer({ width = '100%', height = '100%', className = '' }: ShimmerProps) {
    return (
        <div
            className={`relative overflow-hidden ${className}`}
            style={{ width, height }}
        >
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                    repeatDelay: 0.5
                }}
            />
        </div>
    );
}

/**
 * Stagger Container
 * Animated container for staggered children
 */
interface StaggerContainerProps {
    children: ReactNode;
    staggerDelay?: number;
    className?: string;
}

export function StaggerContainer({
    children,
    staggerDelay = 0.05,
    className = ''
}: StaggerContainerProps) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                visible: {
                    transition: {
                        staggerChildren: staggerDelay
                    }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({
    children,
    className = ''
}: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * Glow Effect
 * Ambient glow on hover
 */
interface GlowEffectProps {
    children: ReactNode;
    color?: string;
    intensity?: 'subtle' | 'medium' | 'strong';
    className?: string;
}

export function GlowEffect({
    children,
    color = 'cyan',
    intensity = 'medium',
    className = ''
}: GlowEffectProps) {
    const glowIntensity = {
        subtle: '0.1',
        medium: '0.2',
        strong: '0.3',
    };

    const glowColors: Record<string, string> = {
        cyan: `rgba(6, 182, 212, ${glowIntensity[intensity]})`,
        purple: `rgba(139, 92, 246, ${glowIntensity[intensity]})`,
        emerald: `rgba(16, 185, 129, ${glowIntensity[intensity]})`,
        amber: `rgba(245, 158, 11, ${glowIntensity[intensity]})`,
        red: `rgba(239, 68, 68, ${glowIntensity[intensity]})`,
    };

    return (
        <motion.div
            className={`relative ${className}`}
            whileHover="hover"
            initial="rest"
        >
            <motion.div
                className="absolute inset-0 rounded-inherit blur-xl opacity-0"
                style={{ background: glowColors[color] }}
                variants={{
                    rest: { opacity: 0 },
                    hover: { opacity: 1, transition: { duration: 0.3 } }
                }}
            />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}

/**
 * Pulse Indicator
 * Animated status pulse
 */
interface PulseIndicatorProps {
    color?: 'cyan' | 'emerald' | 'amber' | 'red';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function PulseIndicator({
    color = 'cyan',
    size = 'md',
    className = ''
}: PulseIndicatorProps) {
    const colorStyles = {
        cyan: 'bg-cyan-400',
        emerald: 'bg-emerald-400',
        amber: 'bg-amber-400',
        red: 'bg-red-400',
    };

    const sizeStyles = {
        sm: 'w-1.5 h-1.5',
        md: 'w-2 h-2',
        lg: 'w-3 h-3',
    };

    return (
        <span className={`relative flex ${sizeStyles[size]} ${className}`}>
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colorStyles[color]}`} />
            <span className={`relative inline-flex rounded-full h-full w-full ${colorStyles[color]}`} />
        </span>
    );
}

/**
 * Ripple Effect
 * Material-style ripple on click
 */
interface RippleButtonProps extends HTMLMotionProps<'button'> {
    children: ReactNode;
    rippleColor?: string;
}

export const RippleButton = forwardRef<HTMLButtonElement, RippleButtonProps>(
    function RippleButton({ children, rippleColor = 'rgba(255,255,255,0.3)', className = '', ...props }, ref) {
        return (
            <motion.button
                ref={ref}
                className={`relative overflow-hidden ${className}`}
                whileTap="tap"
                {...props}
            >
                <motion.span
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: rippleColor }}
                    variants={{
                        tap: {
                            opacity: [0, 0.3, 0],
                            scale: [0.5, 2],
                            transition: { duration: 0.5 }
                        }
                    }}
                />
                {children}
            </motion.button>
        );
    }
);

/**
 * Fade In
 * Simple fade-in animation wrapper
 */
interface FadeInProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    className?: string;
}

export function FadeIn({
    children,
    delay = 0,
    duration = 0.4,
    direction = 'up',
    className = ''
}: FadeInProps) {
    const directionVariants = {
        up: { y: 20 },
        down: { y: -20 },
        left: { x: 20 },
        right: { x: -20 },
        none: {},
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...directionVariants[direction] }}
            animate={{
                opacity: 1,
                y: 0,
                x: 0,
                transition: {
                    delay,
                    duration,
                    ease: [0.16, 1, 0.3, 1]
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * Scale In
 * Scale entrance animation
 */
interface ScaleInProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
}

export function ScaleIn({
    children,
    delay = 0,
    duration = 0.3,
    className = ''
}: ScaleInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
                opacity: 1,
                scale: 1,
                transition: {
                    delay,
                    duration,
                    ease: [0.16, 1, 0.3, 1]
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export default HoverCard;
