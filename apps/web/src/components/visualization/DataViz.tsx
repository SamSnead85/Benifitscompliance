'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface SparklineProps {
    data: number[];
    width?: number;
    height?: number;
    color?: string;
    showEndDot?: boolean;
    className?: string;
}

export function Sparkline({
    data,
    width = 80,
    height = 24,
    color = 'var(--color-synapse-teal)',
    showEndDot = true,
    className = ''
}: SparklineProps) {
    if (data.length === 0) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, i) => ({
        x: (i / (data.length - 1)) * width,
        y: height - ((value - min) / range) * height,
    }));

    const pathD = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');

    const lastPoint = points[points.length - 1];

    return (
        <svg width={width} height={height} className={className}>
            <defs>
                <linearGradient id={`sparkline-gradient-${color.replace(/[^a-z0-9]/gi, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            {/* Fill area */}
            <path
                d={`${pathD} L ${width} ${height} L 0 ${height} Z`}
                fill={`url(#sparkline-gradient-${color.replace(/[^a-z0-9]/gi, '')})`}
            />
            {/* Line */}
            <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            {/* End dot */}
            {showEndDot && lastPoint && (
                <motion.circle
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 }}
                    cx={lastPoint.x}
                    cy={lastPoint.y}
                    r="3"
                    fill={color}
                />
            )}
        </svg>
    );
}


interface MiniBarChartProps {
    data: { label: string; value: number; color?: string }[];
    height?: number;
    className?: string;
}

export function MiniBarChart({ data, height = 40, className = '' }: MiniBarChartProps) {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className={`flex items-end gap-1 ${className}`} style={{ height }}>
            {data.map((item, i) => {
                const barHeight = (item.value / maxValue) * height;
                return (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: barHeight }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        className="flex-1 rounded-t"
                        style={{ backgroundColor: item.color || 'var(--color-synapse-teal)' }}
                        title={`${item.label}: ${item.value}`}
                    />
                );
            })}
        </div>
    );
}


interface TrendIndicatorProps {
    value: number;
    previousValue: number;
    format?: 'percent' | 'number';
    showIcon?: boolean;
    className?: string;
}

export function TrendIndicator({
    value,
    previousValue,
    format = 'percent',
    showIcon = true,
    className = ''
}: TrendIndicatorProps) {
    const diff = value - previousValue;
    const percentChange = previousValue !== 0 ? ((diff / previousValue) * 100) : 0;
    const isPositive = diff >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;

    const displayValue = format === 'percent'
        ? `${Math.abs(percentChange).toFixed(1)}%`
        : Math.abs(diff).toLocaleString();

    return (
        <span className={`inline-flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-critical)]'
            } ${className}`}>
            {showIcon && <Icon className="w-4 h-4" />}
            {isPositive ? '+' : '-'}{displayValue}
        </span>
    );
}


interface GaugeChartProps {
    value: number;
    max?: number;
    label?: string;
    size?: number;
    strokeWidth?: number;
    className?: string;
}

export function GaugeChart({
    value,
    max = 100,
    label,
    size = 100,
    strokeWidth = 8,
    className = ''
}: GaugeChartProps) {
    const percentage = Math.min((value / max) * 100, 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * Math.PI; // Half circle
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getColor = () => {
        if (percentage >= 90) return 'var(--color-success)';
        if (percentage >= 70) return 'var(--color-synapse-teal)';
        if (percentage >= 50) return 'var(--color-warning)';
        return 'var(--color-critical)';
    };

    return (
        <div className={`relative inline-flex flex-col items-center ${className}`}>
            <svg width={size} height={size / 2 + 10} className="-mb-2">
                {/* Background arc */}
                <path
                    d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
                    fill="none"
                    stroke="var(--glass-border)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
                {/* Value arc */}
                <motion.path
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
                    fill="none"
                    stroke={getColor()}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                />
            </svg>
            <div className="text-center -mt-4">
                <p className="text-2xl font-bold text-white">{value}</p>
                {label && <p className="text-xs text-[var(--color-steel)]">{label}</p>}
            </div>
        </div>
    );
}

export default Sparkline;
