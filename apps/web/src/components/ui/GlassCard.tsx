'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
    animated?: boolean;
    delay?: number;
}

const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

export function GlassCard({
    children,
    className = '',
    padding = 'md',
    hover = true,
    animated = true,
    delay = 0,
    ...props
}: GlassCardProps) {
    const baseClasses = 'glass-card';
    const paddingClass = paddingClasses[padding];
    const hoverClass = hover ? 'hover:border-[var(--glass-border-hover)]' : '';

    if (!animated) {
        return (
            <div className={`${baseClasses} ${paddingClass} ${hoverClass} ${className}`}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
            className={`${baseClasses} ${paddingClass} ${hoverClass} ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export default GlassCard;
