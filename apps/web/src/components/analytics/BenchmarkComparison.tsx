'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    Users,
    TrendingUp,
    TrendingDown,
    ChevronRight,
    Filter,
    Search,
    ArrowUpDown
} from 'lucide-react';

interface BenchmarkMetric {
    id: string;
    name: string;
    yourValue: number;
    industryAvg: number;
    topPerformer: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
    category: string;
}

interface BenchmarkComparisonProps {
    metrics?: BenchmarkMetric[];
    industryName?: string;
    className?: string;
}

const defaultMetrics: BenchmarkMetric[] = [
    {
        id: '1',
        name: 'Compliance Score',
        yourValue: 94.7,
        industryAvg: 87.3,
        topPerformer: 99.1,
        unit: '%',
        trend: 'up',
        category: 'Compliance'
    },
    {
        id: '2',
        name: 'Coverage Rate',
        yourValue: 96.2,
        industryAvg: 91.5,
        topPerformer: 98.8,
        unit: '%',
        trend: 'up',
        category: 'Coverage'
    },
    {
        id: '3',
        name: 'Form Accuracy',
        yourValue: 98.5,
        industryAvg: 92.1,
        topPerformer: 99.7,
        unit: '%',
        trend: 'stable',
        category: 'Compliance'
    },
    {
        id: '4',
        name: 'Time to Resolution',
        yourValue: 2.3,
        industryAvg: 4.8,
        topPerformer: 1.2,
        unit: ' days',
        trend: 'down',
        category: 'Operations'
    },
    {
        id: '5',
        name: 'Employee Onboarding',
        yourValue: 3.5,
        industryAvg: 7.2,
        topPerformer: 2.1,
        unit: ' days',
        trend: 'down',
        category: 'Operations'
    },
    {
        id: '6',
        name: 'Automation Rate',
        yourValue: 78,
        industryAvg: 45,
        topPerformer: 92,
        unit: '%',
        trend: 'up',
        category: 'Efficiency'
    },
];

export function BenchmarkComparison({
    metrics = defaultMetrics,
    industryName = 'Healthcare Services',
    className = ''
}: BenchmarkComparisonProps) {
    const [sortBy, setSortBy] = useState<'name' | 'performance'>('performance');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    const categories = ['all', ...new Set(metrics.map(m => m.category))];

    const sortedAndFilteredMetrics = useMemo(() => {
        let filtered = filterCategory === 'all'
            ? metrics
            : metrics.filter(m => m.category === filterCategory);

        return filtered.sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            // Sort by performance relative to industry avg
            const aPerf = (a.yourValue - a.industryAvg) / a.industryAvg;
            const bPerf = (b.yourValue - b.industryAvg) / b.industryAvg;
            return bPerf - aPerf;
        });
    }, [metrics, sortBy, filterCategory]);

    const getPerformanceLevel = (metric: BenchmarkMetric) => {
        const diff = ((metric.yourValue - metric.industryAvg) / metric.industryAvg) * 100;
        if (diff >= 10) return { label: 'Excellent', color: 'var(--color-success)' };
        if (diff >= 0) return { label: 'Above Avg', color: 'var(--color-synapse-teal)' };
        if (diff >= -10) return { label: 'Below Avg', color: 'var(--color-warning)' };
        return { label: 'Needs Work', color: 'var(--color-critical)' };
    };

    return (
        <div className={`glass-card ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-gold)] to-[var(--color-warning)] flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Industry Benchmark</h3>
                            <p className="text-xs text-[var(--color-steel)]">Compared to {industryName}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSortBy(s => s === 'name' ? 'performance' : 'name')}
                        className="btn-secondary text-xs"
                    >
                        <ArrowUpDown className="w-4 h-4" />
                        Sort by {sortBy === 'name' ? 'Performance' : 'Name'}
                    </button>
                </div>

                {/* Category filters */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${filterCategory === cat
                                    ? 'bg-[var(--color-synapse-teal)] text-black'
                                    : 'bg-[var(--glass-bg)] text-[var(--color-steel)] hover:text-white'
                                }`}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Metrics */}
            <div className="divide-y divide-[var(--glass-border)]">
                {sortedAndFilteredMetrics.map((metric, i) => {
                    const performance = getPerformanceLevel(metric);
                    const yourPercent = (metric.yourValue / metric.topPerformer) * 100;
                    const avgPercent = (metric.industryAvg / metric.topPerformer) * 100;

                    return (
                        <motion.div
                            key={metric.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="p-4"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-white">{metric.name}</span>
                                    <span
                                        className="px-2 py-0.5 rounded text-xs font-medium"
                                        style={{
                                            backgroundColor: `${performance.color}20`,
                                            color: performance.color
                                        }}
                                    >
                                        {performance.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-[var(--color-steel)]">
                                        Industry: <span className="text-white">{metric.industryAvg}{metric.unit}</span>
                                    </span>
                                    <span className="text-[var(--color-synapse-gold)]">
                                        You: <span className="font-bold">{metric.yourValue}{metric.unit}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Comparison bar */}
                            <div className="relative h-3 rounded-full bg-[var(--glass-bg)]">
                                {/* Industry average marker */}
                                <div
                                    className="absolute top-0 bottom-0 w-0.5 bg-white/50 z-10"
                                    style={{ left: `${avgPercent}%` }}
                                />
                                {/* Your value bar */}
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${yourPercent}%` }}
                                    transition={{ duration: 0.5, delay: i * 0.05 }}
                                    className="absolute left-0 top-0 bottom-0 rounded-full"
                                    style={{ backgroundColor: performance.color }}
                                />
                                {/* Top performer marker */}
                                <div
                                    className="absolute top-0 bottom-0 w-1 bg-[var(--color-synapse-gold)] rounded-full z-10"
                                    style={{ right: 0 }}
                                />
                            </div>

                            {/* Legend */}
                            <div className="flex items-center justify-between mt-2 text-[10px] text-[var(--color-steel)]">
                                <span>0</span>
                                <span>Top: {metric.topPerformer}{metric.unit}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

export default BenchmarkComparison;
