'use client';

import { motion } from 'framer-motion';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    dot?: boolean;
    removable?: boolean;
    onRemove?: () => void;
    className?: string;
}

const variantStyles = {
    default: 'bg-[var(--glass-bg)] text-[var(--color-steel)] border-[var(--glass-border)]',
    success: 'bg-[rgba(34,197,94,0.1)] text-[var(--color-success)] border-[var(--color-success)]',
    warning: 'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)] border-[var(--color-warning)]',
    error: 'bg-[rgba(239,68,68,0.1)] text-[var(--color-critical)] border-[var(--color-critical)]',
    info: 'bg-[rgba(20,184,166,0.1)] text-[var(--color-synapse-teal)] border-[var(--color-synapse-teal)]',
    outline: 'bg-transparent text-white border-[var(--glass-border)]',
};

const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-2.5 py-1',
};

export function Badge({
    children,
    variant = 'default',
    size = 'md',
    dot = false,
    removable = false,
    onRemove,
    className = ''
}: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        >
            {dot && (
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
            )}
            {children}
            {removable && onRemove && (
                <button
                    onClick={onRemove}
                    className="ml-0.5 hover:opacity-70 transition-opacity"
                >
                    ×
                </button>
            )}
        </span>
    );
}


// Status badge with predefined states
type StatusType = 'active' | 'inactive' | 'pending' | 'error' | 'complete';

interface StatusBadgeProps {
    status: StatusType;
    className?: string;
}

const statusConfig = {
    active: { label: 'Active', variant: 'success' as const },
    inactive: { label: 'Inactive', variant: 'default' as const },
    pending: { label: 'Pending', variant: 'warning' as const },
    error: { label: 'Error', variant: 'error' as const },
    complete: { label: 'Complete', variant: 'info' as const },
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
    const config = statusConfig[status];
    return (
        <Badge variant={config.variant} dot className={className}>
            {config.label}
        </Badge>
    );
}


// Notification count badge
interface CountBadgeProps {
    count: number;
    max?: number;
    className?: string;
}

export function CountBadge({ count, max = 99, className = '' }: CountBadgeProps) {
    if (count === 0) return null;

    return (
        <span
            className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold bg-[var(--color-critical)] text-white ${className}`}
        >
            {count > max ? `${max}+` : count}
        </span>
    );
}

export default Badge;
