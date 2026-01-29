'use client';

import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    BarChart3,
    PieChart,
    LineChart,
    Activity,
    Calendar,
    Users,
    DollarSign,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';

interface TrendChartProps {
    title: string;
    data: { label: string; value: number; change?: number }[];
    type?: 'bar' | 'line';
    height?: number;
    className?: string;
}

/**
 * Trend Chart
 * Visualize data trends over time
 */
export function TrendChart({
    title,
    data,
    type = 'bar',
    height = 200,
    className = '',
}: TrendChartProps) {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-5 ${className}`}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <div className="flex items-center gap-1 text-[10px] text-[#64748B]">
                    {type === 'bar' ? <BarChart3 className="w-3 h-3" /> : <LineChart className="w-3 h-3" />}
                    {data.length} periods
                </div>
            </div>

            <div className="relative" style={{ height }}>
                {type === 'bar' ? (
                    <div className="flex items-end justify-between h-full gap-2">
                        {data.map((item, index) => (
                            <motion.div
                                key={item.label}
                                initial={{ height: 0 }}
                                animate={{ height: `${(item.value / maxValue) * 100}%` }}
                                transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="flex-1 flex flex-col items-center"
                            >
                                <div
                                    className="w-full rounded-t-md bg-gradient-to-t from-cyan-600/80 to-cyan-400/80 hover:from-cyan-500 hover:to-cyan-300 transition-colors cursor-pointer relative group"
                                    style={{ height: '100%' }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="px-2 py-1 bg-[#15151F] border border-[rgba(255,255,255,0.1)] rounded text-xs text-white whitespace-nowrap">
                                            {item.value.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <svg viewBox={`0 0 ${data.length * 50} ${height}`} className="w-full h-full overflow-visible">
                        <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="rgb(6, 182, 212)" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="rgb(6, 182, 212)" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Area Fill */}
                        <motion.path
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            d={`
                M 0 ${height}
                ${data.map((item, i) => `L ${i * 50 + 25} ${height - (item.value / maxValue) * (height - 20)}`).join(' ')}
                L ${(data.length - 1) * 50 + 25} ${height}
                Z
              `}
                            fill="url(#lineGradient)"
                        />

                        {/* Line */}
                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            d={data.map((item, i) => `${i === 0 ? 'M' : 'L'} ${i * 50 + 25} ${height - (item.value / maxValue) * (height - 20)}`).join(' ')}
                            fill="none"
                            stroke="rgb(6, 182, 212)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Points */}
                        {data.map((item, i) => (
                            <motion.circle
                                key={i}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: i * 0.1 + 0.5 }}
                                cx={i * 50 + 25}
                                cy={height - (item.value / maxValue) * (height - 20)}
                                r="4"
                                fill="#0A0A0F"
                                stroke="rgb(6, 182, 212)"
                                strokeWidth="2"
                                className="cursor-pointer hover:r-[6]"
                            />
                        ))}
                    </svg>
                )}
            </div>

            {/* Labels */}
            <div className="flex justify-between mt-3">
                {data.map(item => (
                    <div key={item.label} className="flex-1 text-center">
                        <p className="text-[9px] text-[#64748B]">{item.label}</p>
                        {item.change !== undefined && (
                            <p className={`text-[9px] flex items-center justify-center gap-0.5 ${item.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {item.change >= 0 ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                                {Math.abs(item.change)}%
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

/**
 * Donut Chart
 * Proportional data visualization
 */
interface DonutChartProps {
    title: string;
    data: { label: string; value: number; color: string }[];
    centerLabel?: string;
    centerValue?: string | number;
    size?: number;
    className?: string;
}

export function DonutChart({
    title,
    data,
    centerLabel,
    centerValue,
    size = 160,
    className = '',
}: DonutChartProps) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const radius = size / 2 - 20;
    const circumference = 2 * Math.PI * radius;

    let currentOffset = 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-5 ${className}`}
        >
            <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>

            <div className="flex items-center gap-6">
                {/* Chart */}
                <div className="relative" style={{ width: size, height: size }}>
                    <svg viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
                        {data.map((segment, index) => {
                            const segmentLength = (segment.value / total) * circumference;
                            const offset = currentOffset;
                            currentOffset += segmentLength;

                            return (
                                <motion.circle
                                    key={segment.label}
                                    initial={{ strokeDashoffset: circumference }}
                                    animate={{ strokeDashoffset: circumference - segmentLength }}
                                    transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    cx={size / 2}
                                    cy={size / 2}
                                    r={radius}
                                    fill="none"
                                    stroke={segment.color}
                                    strokeWidth="16"
                                    strokeDasharray={circumference}
                                    style={{
                                        strokeDashoffset: circumference - segmentLength,
                                        transform: `rotate(${(offset / circumference) * 360}deg)`,
                                        transformOrigin: 'center',
                                    }}
                                    className="transition-all duration-300"
                                />
                            );
                        })}
                    </svg>

                    {/* Center Text */}
                    {(centerLabel || centerValue) && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            {centerValue && (
                                <p className="text-2xl font-bold text-white font-mono">{centerValue}</p>
                            )}
                            {centerLabel && (
                                <p className="text-[10px] text-[#64748B]">{centerLabel}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-2">
                    {data.map(segment => (
                        <div key={segment.label} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: segment.color }} />
                                <span className="text-xs text-[#94A3B8]">{segment.label}</span>
                            </div>
                            <span className="text-xs font-mono text-white">
                                {segment.value.toLocaleString()} ({((segment.value / total) * 100).toFixed(1)}%)
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

/**
 * KPI Grid
 * Key performance indicators dashboard
 */
interface KPI {
    id: string;
    label: string;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down' | 'flat';
    icon?: React.ReactNode;
    status?: 'good' | 'warning' | 'danger';
}

interface KPIGridProps {
    kpis: KPI[];
    columns?: 2 | 3 | 4;
    className?: string;
}

export function KPIGrid({
    kpis,
    columns = 4,
    className = '',
}: KPIGridProps) {
    const colClasses = {
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
    };

    const getStatusColor = (status?: KPI['status']) => {
        switch (status) {
            case 'good': return 'text-emerald-400';
            case 'warning': return 'text-amber-400';
            case 'danger': return 'text-red-400';
            default: return 'text-white';
        }
    };

    return (
        <div className={`grid ${colClasses[columns]} gap-4 ${className}`}>
            {kpis.map((kpi, index) => (
                <motion.div
                    key={kpi.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card p-4"
                >
                    <div className="flex items-start justify-between mb-2">
                        {kpi.icon && (
                            <div className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-[#64748B]">
                                {kpi.icon}
                            </div>
                        )}
                        {kpi.change !== undefined && (
                            <div className={`flex items-center gap-0.5 text-xs ${kpi.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {kpi.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {Math.abs(kpi.change)}%
                            </div>
                        )}
                    </div>
                    <p className={`text-2xl font-bold font-mono mb-1 ${getStatusColor(kpi.status)}`}>
                        {kpi.value}
                    </p>
                    <p className="text-xs text-[#64748B]">{kpi.label}</p>
                </motion.div>
            ))}
        </div>
    );
}

/**
 * Comparison Bar
 * Compare two values visually
 */
interface ComparisonBarProps {
    title: string;
    leftLabel: string;
    leftValue: number;
    rightLabel: string;
    rightValue: number;
    format?: (value: number) => string;
    className?: string;
}

export function ComparisonBar({
    title,
    leftLabel,
    leftValue,
    rightLabel,
    rightValue,
    format = (v) => v.toLocaleString(),
    className = '',
}: ComparisonBarProps) {
    const total = leftValue + rightValue;
    const leftPercent = (leftValue / total) * 100;
    const rightPercent = (rightValue / total) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-4 ${className}`}
        >
            <h4 className="text-xs font-medium text-[#94A3B8] mb-3">{title}</h4>

            <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-cyan-400">{leftLabel}</span>
                <span className="text-purple-400">{rightLabel}</span>
            </div>

            <div className="flex h-3 rounded-full overflow-hidden bg-[rgba(255,255,255,0.04)]">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${leftPercent}%` }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-l-full"
                />
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rightPercent}%` }}
                    transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-gradient-to-r from-purple-400 to-purple-500 rounded-r-full"
                />
            </div>

            <div className="flex items-center justify-between text-xs mt-2">
                <span className="font-mono text-white">{format(leftValue)}</span>
                <span className="font-mono text-white">{format(rightValue)}</span>
            </div>
        </motion.div>
    );
}

export default TrendChart;
