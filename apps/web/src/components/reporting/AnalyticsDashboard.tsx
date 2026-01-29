'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    LineChart,
    PieChart,
    TrendingUp,
    TrendingDown,
    Download,
    Filter,
    Calendar,
    ChevronDown,
    Maximize2,
    RefreshCw
} from 'lucide-react';

interface AnalyticsWidgetProps {
    title: string;
    data: number[];
    labels: string[];
    type: 'bar' | 'line' | 'area' | 'donut';
    trend?: { value: number; direction: 'up' | 'down' };
    className?: string;
}

export function AnalyticsWidget({
    title,
    data,
    labels,
    type,
    trend,
    className = ''
}: AnalyticsWidgetProps) {
    const maxValue = Math.max(...data);
    const total = data.reduce((a, b) => a + b, 0);

    const colors = [
        'var(--color-synapse-teal)',
        'var(--color-synapse-cyan)',
        'var(--color-synapse-gold)',
        'var(--color-success)',
        'var(--color-warning)',
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-5 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {type === 'bar' && <BarChart3 className="w-4 h-4 text-[var(--color-synapse-teal)]" />}
                    {type === 'line' && <LineChart className="w-4 h-4 text-[var(--color-synapse-teal)]" />}
                    {type === 'donut' && <PieChart className="w-4 h-4 text-[var(--color-synapse-teal)]" />}
                    <h4 className="font-medium text-white">{title}</h4>
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm ${trend.direction === 'up' ? 'text-[var(--color-success)]' : 'text-[var(--color-critical)]'
                        }`}>
                        {trend.direction === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {trend.value}%
                    </div>
                )}
            </div>

            {/* Chart */}
            {type === 'bar' && (
                <div className="h-40 flex items-end justify-between gap-2">
                    {data.map((value, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(value / maxValue) * 100}%` }}
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                                className="w-full rounded-t"
                                style={{ backgroundColor: colors[i % colors.length], minHeight: 4 }}
                            />
                            <span className="text-xs text-[var(--color-steel)]">{labels[i]}</span>
                        </div>
                    ))}
                </div>
            )}

            {type === 'line' && (
                <div className="h-40 relative">
                    <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="var(--color-synapse-teal)" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="var(--color-synapse-teal)" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1 }}
                            d={`M ${data.map((v, i) => `${(i / (data.length - 1)) * 100},${50 - (v / maxValue) * 45}`).join(' L ')}`}
                            fill="none"
                            stroke="var(--color-synapse-teal)"
                            strokeWidth="2"
                        />
                        <path
                            d={`M 0,50 L ${data.map((v, i) => `${(i / (data.length - 1)) * 100},${50 - (v / maxValue) * 45}`).join(' L ')} L 100,50 Z`}
                            fill="url(#lineGradient)"
                        />
                    </svg>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                        {labels.map((label, i) => (
                            <span key={i} className="text-xs text-[var(--color-steel)]">{label}</span>
                        ))}
                    </div>
                </div>
            )}

            {type === 'donut' && (
                <div className="flex items-center gap-6">
                    <div className="relative w-32 h-32">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            {data.map((value, i) => {
                                const prevTotal = data.slice(0, i).reduce((a, b) => a + b, 0);
                                const percentage = (value / total) * 100;
                                const circumference = 2 * Math.PI * 40;
                                const offset = (prevTotal / total) * circumference;
                                const dashArray = (percentage / 100) * circumference;

                                return (
                                    <motion.circle
                                        key={i}
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke={colors[i % colors.length]}
                                        strokeWidth="12"
                                        strokeDasharray={`${dashArray} ${circumference}`}
                                        strokeDashoffset={-offset}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                    />
                                );
                            })}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold text-white font-mono">{total}</span>
                        </div>
                    </div>
                    <div className="flex-1 space-y-2">
                        {labels.map((label, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: colors[i % colors.length] }}
                                />
                                <span className="text-sm text-[var(--color-silver)] flex-1">{label}</span>
                                <span className="text-sm font-mono text-white">{data[i]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}

interface AnalyticsDashboardProps {
    className?: string;
}

export function AnalyticsDashboard({ className = '' }: AnalyticsDashboardProps) {
    const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`space-y-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                    <h2 className="text-xl font-semibold text-white">Analytics Dashboard</h2>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-[var(--glass-bg)] rounded-lg p-1">
                        {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => setDateRange(range)}
                                className={`px-3 py-1.5 rounded text-sm transition-colors ${dateRange === range
                                        ? 'bg-[var(--color-synapse-teal)] text-black font-medium'
                                        : 'text-[var(--color-steel)] hover:text-white'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                    <button className="btn-secondary">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                    <button className="btn-secondary">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Widgets Grid */}
            <div className="grid grid-cols-2 gap-6">
                <AnalyticsWidget
                    title="Compliance by Month"
                    type="bar"
                    data={[92, 94, 93, 95, 96, 97]}
                    labels={['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']}
                    trend={{ value: 2.1, direction: 'up' }}
                />
                <AnalyticsWidget
                    title="FTE Trend"
                    type="line"
                    data={[4200, 4350, 4280, 4420, 4380, 4521]}
                    labels={['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']}
                    trend={{ value: 3.2, direction: 'up' }}
                />
                <AnalyticsWidget
                    title="Coverage Distribution"
                    type="donut"
                    data={[3842, 456, 223]}
                    labels={['Full Coverage', 'Partial', 'Waived']}
                />
                <AnalyticsWidget
                    title="Safe Harbor Usage"
                    type="donut"
                    data={[2145, 1234, 463]}
                    labels={['Rate of Pay', 'FPL', 'W-2']}
                />
            </div>

            {/* Large Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-white">Workforce Hours Analysis</h3>
                    <div className="flex items-center gap-2">
                        <button className="btn-secondary text-sm">
                            <Maximize2 className="w-4 h-4" />
                        </button>
                        <button className="btn-secondary text-sm">
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="h-64 flex items-end gap-1">
                    {Array.from({ length: 52 }).map((_, i) => {
                        const height = 20 + Math.random() * 80;
                        const isHighlight = i >= 48;
                        return (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ duration: 0.5, delay: i * 0.01 }}
                                className="flex-1 rounded-t"
                                style={{
                                    backgroundColor: isHighlight
                                        ? 'var(--color-synapse-teal)'
                                        : 'var(--glass-border)'
                                }}
                            />
                        );
                    })}
                </div>
                <div className="flex justify-between mt-2 text-xs text-[var(--color-steel)]">
                    <span>Week 1</span>
                    <span>Week 13</span>
                    <span>Week 26</span>
                    <span>Week 39</span>
                    <span>Week 52</span>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default AnalyticsDashboard;
