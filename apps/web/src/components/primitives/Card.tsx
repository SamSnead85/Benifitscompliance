'use client';

import { forwardRef, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    onClick?: () => void;
}

const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(({
    children,
    className = '',
    hover = false,
    padding = 'md',
    onClick,
}, ref) => {
    const Component = hover ? motion.div : 'div';
    const motionProps = hover ? { whileHover: { y: -2 } } : {};

    return (
        <Component
            ref={ref}
            onClick={onClick}
            className={`rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] ${hover ? 'cursor-pointer transition-colors hover:border-[var(--glass-border-hover)]' : ''
                } ${paddingStyles[padding]} ${className}`}
            {...motionProps}
        >
            {children}
        </Component>
    );
});

Card.displayName = 'Card';


interface CardHeaderProps {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    action?: ReactNode;
    className?: string;
}

export function CardHeader({ title, subtitle, icon, action, className = '' }: CardHeaderProps) {
    return (
        <div className={`flex items-center justify-between ${className}`}>
            <div className="flex items-center gap-3">
                {icon && (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)]/20 to-[var(--color-synapse-cyan)]/20 flex items-center justify-center">
                        {icon}
                    </div>
                )}
                <div>
                    <h3 className="font-semibold text-white">{title}</h3>
                    {subtitle && <p className="text-sm text-[var(--color-steel)]">{subtitle}</p>}
                </div>
            </div>
            {action}
        </div>
    );
}


interface CardContentProps {
    children: ReactNode;
    className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
    return (
        <div className={className}>
            {children}
        </div>
    );
}


interface CardFooterProps {
    children: ReactNode;
    className?: string;
    border?: boolean;
}

export function CardFooter({ children, className = '', border = true }: CardFooterProps) {
    return (
        <div className={`${border ? 'border-t border-[var(--glass-border)] pt-4 mt-4' : ''} ${className}`}>
            {children}
        </div>
    );
}


// Stat card variant
interface StatCardProps {
    title: string;
    value: string | number;
    change?: { value: number; direction: 'up' | 'down' };
    icon?: ReactNode;
    className?: string;
}

export function StatCard({ title, value, change, icon, className = '' }: StatCardProps) {
    return (
        <Card className={className} hover>
            <div className="flex items-start justify-between mb-3">
                {icon && (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)]/20 to-[var(--color-synapse-cyan)]/20 flex items-center justify-center">
                        {icon}
                    </div>
                )}
                {change && (
                    <span className={`text-sm font-medium ${change.direction === 'up' ? 'text-[var(--color-success)]' : 'text-[var(--color-critical)]'
                        }`}>
                        {change.direction === 'up' ? '↑' : '↓'} {Math.abs(change.value)}%
                    </span>
                )}
            </div>
            <p className="text-2xl font-bold text-white mb-1">{value}</p>
            <p className="text-sm text-[var(--color-steel)]">{title}</p>
        </Card>
    );
}

export default Card;
