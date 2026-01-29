'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import {
    TrendingUp,
    TrendingDown,
    Minus,
    ArrowUpRight,
    ArrowDownRight,
    Sparkles,
} from 'lucide-react';

interface PremiumMetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: {
        value: number;
        direction: 'up' | 'down' | 'neutral';
        label?: string;
    };
    icon?: ReactNode;
    accentColor?: 'teal' | 'emerald' | 'amber' | 'coral' | 'indigo';
    size?: 'sm' | 'md' | 'lg';
    showSparkle?: boolean;
    className?: string;
}

const accentColors = {
    teal: {
        gradient: 'from-cyan-500 to-teal-500',
        glow: 'rgba(6, 182, 212, 0.3)',
        bg: 'rgba(6, 182, 212, 0.1)',
        text: 'text-cyan-400',
    },
    emerald: {
        gradient: 'from-emerald-500 to-green-500',
        glow: 'rgba(16, 185, 129, 0.3)',
        bg: 'rgba(16, 185, 129, 0.1)',
        text: 'text-emerald-400',
    },
    amber: {
        gradient: 'from-amber-500 to-orange-500',
        glow: 'rgba(245, 158, 11, 0.3)',
        bg: 'rgba(245, 158, 11, 0.1)',
        text: 'text-amber-400',
    },
    coral: {
        gradient: 'from-red-500 to-rose-500',
        glow: 'rgba(239, 68, 68, 0.3)',
        bg: 'rgba(239, 68, 68, 0.1)',
        text: 'text-red-400',
    },
    indigo: {
        gradient: 'from-indigo-500 to-purple-500',
        glow: 'rgba(99, 102, 241, 0.3)',
        bg: 'rgba(99, 102, 241, 0.1)',
        text: 'text-indigo-400',
    },
};

/**
 * Premium Executive Metric Card
 * Designed for C-suite dashboard visibility
 */
export function PremiumMetricCard({
    title,
    value,
    subtitle,
    trend,
    icon,
    accentColor = 'teal',
    size = 'md',
    showSparkle = false,
    className = '',
}: PremiumMetricCardProps) {
    const accent = accentColors[accentColor];

    const sizeClasses = {
        sm: 'p-4',
        md: 'p-5',
        lg: 'p-6',
    };

    const valueClasses = {
        sm: 'text-2xl',
        md: 'text-3xl',
        lg: 'text-4xl',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className={`
        relative overflow-hidden rounded-lg
        bg-[rgba(255,255,255,0.03)] backdrop-blur-xl
        border border-[rgba(255,255,255,0.06)]
        hover:border-[rgba(255,255,255,0.12)]
        hover:bg-[rgba(255,255,255,0.05)]
        transition-all duration-300
        ${sizeClasses[size]}
        ${className}
      `}
            style={{
                boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03) inset`,
            }}
        >
            {/* Top accent line */}
            <div
                className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${accent.gradient} opacity-60`}
            />

            {/* Glow effect on hover */}
            <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                    background: `radial-gradient(circle at 50% 0%, ${accent.glow}, transparent 60%)`,
                }}
            />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium uppercase tracking-wider text-[#64748B]">
                        {title}
                    </span>
                    {icon && (
                        <div
                            className={`w-8 h-8 rounded-md flex items-center justify-center ${accent.text}`}
                            style={{ background: accent.bg }}
                        >
                            {icon}
                        </div>
                    )}
                    {showSparkle && !icon && (
                        <Sparkles className={`w-4 h-4 ${accent.text}`} />
                    )}
                </div>

                {/* Value */}
                <div className="flex items-baseline gap-2">
                    <span
                        className={`font-mono font-bold text-white ${valueClasses[size]}`}
                        style={{ fontFamily: 'var(--font-mono)' }}
                    >
                        {value}
                    </span>
                    {subtitle && (
                        <span className="text-sm text-[#94A3B8]">{subtitle}</span>
                    )}
                </div>

                {/* Trend */}
                {trend && (
                    <div className="flex items-center gap-1.5 mt-3">
                        {trend.direction === 'up' && (
                            <div className="flex items-center gap-1 text-emerald-400">
                                <ArrowUpRight className="w-4 h-4" />
                                <span className="text-xs font-semibold">+{trend.value}%</span>
                            </div>
                        )}
                        {trend.direction === 'down' && (
                            <div className="flex items-center gap-1 text-red-400">
                                <ArrowDownRight className="w-4 h-4" />
                                <span className="text-xs font-semibold">-{trend.value}%</span>
                            </div>
                        )}
                        {trend.direction === 'neutral' && (
                            <div className="flex items-center gap-1 text-[#94A3B8]">
                                <Minus className="w-4 h-4" />
                                <span className="text-xs font-semibold">{trend.value}%</span>
                            </div>
                        )}
                        {trend.label && (
                            <span className="text-xs text-[#64748B]">{trend.label}</span>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

/**
 * Executive KPI Strip
 * Horizontal row of key metrics for C-suite dashboards
 */
interface ExecutiveKPIStripProps {
    metrics: Array<{
        id: string;
        title: string;
        value: string | number;
        trend?: { value: number; direction: 'up' | 'down' | 'neutral' };
        accentColor?: 'teal' | 'emerald' | 'amber' | 'coral' | 'indigo';
    }>;
    className?: string;
}

export function ExecutiveKPIStrip({ metrics, className = '' }: ExecutiveKPIStripProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`
        grid gap-4
        ${metrics.length === 4 ? 'grid-cols-4' :
                    metrics.length === 3 ? 'grid-cols-3' :
                        metrics.length === 5 ? 'grid-cols-5' : 'grid-cols-4'}
        ${className}
      `}
        >
            {metrics.map((metric, index) => (
                <motion.div
                    key={metric.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <PremiumMetricCard
                        title={metric.title}
                        value={metric.value}
                        trend={metric.trend}
                        accentColor={metric.accentColor || 'teal'}
                        size="md"
                    />
                </motion.div>
            ))}
        </motion.div>
    );
}

/**
 * Hero Value Display
 * Large format metric for dashboard headers
 */
interface HeroValueProps {
    label: string;
    value: string | number;
    suffix?: string;
    description?: string;
    status?: 'healthy' | 'warning' | 'critical';
    className?: string;
}

export function HeroValue({
    label,
    value,
    suffix,
    description,
    status = 'healthy',
    className = '',
}: HeroValueProps) {
    const statusColors = {
        healthy: 'from-emerald-400 to-cyan-400',
        warning: 'from-amber-400 to-orange-400',
        critical: 'from-red-400 to-rose-400',
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-center ${className}`}
        >
            <p className="text-xs font-medium uppercase tracking-widest text-[#64748B] mb-2">
                {label}
            </p>
            <div className="flex items-baseline justify-center gap-2">
                <span
                    className={`text-6xl font-bold bg-gradient-to-r ${statusColors[status]} bg-clip-text text-transparent`}
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    {value}
                </span>
                {suffix && (
                    <span className="text-2xl font-medium text-[#94A3B8]">{suffix}</span>
                )}
            </div>
            {description && (
                <p className="text-sm text-[#64748B] mt-2">{description}</p>
            )}
        </motion.div>
    );
}

export default PremiumMetricCard;
