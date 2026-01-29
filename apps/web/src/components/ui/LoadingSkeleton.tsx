'use client';

import { ReactNode } from 'react';

interface LoadingSkeletonProps {
    className?: string;
    variant?: 'text' | 'circle' | 'rect';
    width?: string | number;
    height?: string | number;
    lines?: number;
}

export function LoadingSkeleton({
    className = '',
    variant = 'rect',
    width,
    height,
    lines = 1
}: LoadingSkeletonProps) {
    const baseClasses = 'animate-pulse bg-[var(--glass-bg-light)] rounded';

    const variantClasses = {
        text: 'h-4 rounded',
        circle: 'rounded-full',
        rect: 'rounded-lg',
    };

    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;

    if (lines > 1) {
        return (
            <div className={`space-y-2 ${className}`}>
                {Array.from({ length: lines }).map((_, i) => (
                    <div
                        key={i}
                        className={`${baseClasses} ${variantClasses.text}`}
                        style={{
                            ...style,
                            width: i === lines - 1 ? '75%' : width || '100%'
                        }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        />
    );
}

// Preset skeletons
export function MetricCardSkeleton() {
    return (
        <div className="glass-card p-6 space-y-4">
            <div className="flex items-start justify-between">
                <LoadingSkeleton variant="rect" width={40} height={40} />
                <LoadingSkeleton variant="text" width={60} height={20} />
            </div>
            <LoadingSkeleton variant="text" width="60%" height={32} />
            <LoadingSkeleton variant="text" width="40%" height={16} />
        </div>
    );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
    return (
        <tr>
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i}>
                    <LoadingSkeleton variant="text" width="80%" />
                </td>
            ))}
        </tr>
    );
}

export function CardListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="glass-card p-4 flex items-center gap-4">
                    <LoadingSkeleton variant="circle" width={48} height={48} />
                    <div className="flex-1">
                        <LoadingSkeleton variant="text" width="60%" className="mb-2" />
                        <LoadingSkeleton variant="text" width="40%" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default LoadingSkeleton;
