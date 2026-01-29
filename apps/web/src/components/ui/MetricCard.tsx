'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface MetricCardProps {
    label: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
    icon?: LucideIcon;
    iconColor?: string;
    subValue?: string;
    animated?: boolean;
}

export function MetricCard({
    label,
    value,
    change,
    trend,
    icon: Icon,
    iconColor = 'var(--color-synapse-teal)',
    subValue,
    animated = true
}: MetricCardProps) {
    const Wrapper = animated ? motion.div : 'div';
    const animationProps = animated ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 }
    } : {};

    const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
    const trendClass = trend === 'up' ? 'metric-trend--up' : 'metric-trend--down';

    return (
        <Wrapper
            className="metric-card"
            {...(animated ? animationProps : {})}
        >
            <div className="flex items-start justify-between mb-4">
                {Icon && (
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ background: `${iconColor}20` }}
                    >
                        <Icon className="w-5 h-5" style={{ color: iconColor }} />
                    </div>
                )}
                {change && trend && trend !== 'neutral' && (
                    <div className={`metric-trend ${trendClass} flex items-center gap-1`}>
                        <TrendIcon className="w-3 h-3" />
                        {change}
                    </div>
                )}
            </div>
            <div className="metric-value">{value}</div>
            <div className="metric-label">{label}</div>
            {subValue && (
                <div className="text-xs text-[var(--color-steel)] mt-1">{subValue}</div>
            )}
        </Wrapper>
    );
}

export default MetricCard;
