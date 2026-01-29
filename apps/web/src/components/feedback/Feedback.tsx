'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
    className?: string;
}

export function Tooltip({
    content,
    children,
    position = 'top',
    delay = 200,
    className = ''
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showTooltip = () => {
        timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    const arrowClasses = {
        top: 'top-full left-1/2 -translate-x-1/2 border-t-[var(--glass-bg)] border-x-transparent border-b-transparent',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[var(--glass-bg)] border-x-transparent border-t-transparent',
        left: 'left-full top-1/2 -translate-y-1/2 border-l-[var(--glass-bg)] border-y-transparent border-r-transparent',
        right: 'right-full top-1/2 -translate-y-1/2 border-r-[var(--glass-bg)] border-y-transparent border-l-transparent',
    };

    return (
        <div
            className={`relative inline-block ${className}`}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className={`absolute z-50 ${positionClasses[position]}`}
                    >
                        <div className="px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] shadow-xl text-sm text-white whitespace-nowrap">
                            {content}
                        </div>
                        <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'shimmer' | 'none';
}

export function Skeleton({
    className = '',
    variant = 'text',
    width,
    height,
    animation = 'pulse'
}: SkeletonProps) {
    const variantClasses = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
    };

    const animationClasses = {
        pulse: 'animate-pulse',
        shimmer: 'overflow-hidden relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent',
        none: '',
    };

    return (
        <div
            className={`bg-[var(--glass-bg)] ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
            style={{
                width: width,
                height: height,
                aspectRatio: variant === 'circular' ? '1' : undefined
            }}
        />
    );
}


// Pre-built skeleton patterns
export function CardSkeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`glass-card p-5 ${className}`}>
            <div className="flex items-center gap-3 mb-4">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1">
                    <Skeleton width="60%" className="mb-2" />
                    <Skeleton width="40%" height={12} />
                </div>
            </div>
            <Skeleton className="mb-2" />
            <Skeleton className="mb-2" />
            <Skeleton width="80%" />
        </div>
    );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
    return (
        <tr className="border-b border-[var(--glass-border)]">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <Skeleton width={i === 0 ? 120 : i === columns - 1 ? 60 : 80} />
                </td>
            ))}
        </tr>
    );
}

export function ListItemSkeleton() {
    return (
        <div className="flex items-center gap-3 p-3">
            <Skeleton variant="circular" width={36} height={36} />
            <div className="flex-1">
                <Skeleton width="70%" className="mb-1" />
                <Skeleton width="40%" height={12} />
            </div>
        </div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="glass-card p-5">
            <Skeleton variant="circular" width={40} height={40} className="mb-3" />
            <Skeleton width={80} height={32} className="mb-2" />
            <Skeleton width="60%" height={14} />
        </div>
    );
}

export default Tooltip;
