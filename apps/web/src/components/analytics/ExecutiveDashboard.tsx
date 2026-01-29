'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LineChart,
    BarChart3,
    PieChart,
    TrendingUp,
    Calendar,
    Download,
    Filter,
    RefreshCw,
    ChevronDown,
    Maximize2
} from 'lucide-react';

interface MetricTile {
    id: string;
    title: string;
    value: string | number;
    change?: { value: number; direction: 'up' | 'down' };
    trend?: number[];
    chartType?: 'line' | 'bar' | 'pie';
}

interface ExecutiveDashboardProps {
    metrics?: MetricTile[];
    dateRange?: string;
    onExport?: () => void;
    onRefresh?: () => void;
    className?: string;
}

const defaultMetrics: MetricTile[] = [
    {
        id: '1',
        title: 'Total Employees',
        value: '1,247',
        change: { value: 3.2, direction: 'up' },
        trend: [1180, 1195, 1210, 1225, 1235, 1247],
        chartType: 'line'
    },
    {
        id: '2',
        title: 'Compliance Score',
        value: '94.7%',
        change: { value: 2.1, direction: 'up' },
        trend: [89, 91, 92, 93, 94, 95],
        chartType: 'line'
    },
    {
        id: '3',
        title: 'Forms Generated',
        value: '3,841',
        trend: [620, 580, 640, 710, 680, 700],
        chartType: 'bar'
    },
    {
        id: '4',
        title: 'Pending Issues',
        value: '23',
        change: { value: 15, direction: 'down' },
        trend: [45, 38, 32, 28, 25, 23],
        chartType: 'line'
    },
    {
        id: '5',
        title: 'Coverage Rate',
        value: '96.2%',
        change: { value: 0.8, direction: 'up' },
        chartType: 'pie'
    },
    {
        id: '6',
        title: 'Estimated Penalties',
        value: '$0',
        change: { value: 100, direction: 'down' },
        trend: [45000, 32000, 18000, 8000, 2000, 0],
        chartType: 'line'
    },
];

export function ExecutiveDashboard({
    metrics = defaultMetrics,
    dateRange = 'Last 6 months',
    onExport,
    onRefresh,
    className = ''
}: ExecutiveDashboardProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await new Promise(r => setTimeout(r, 1500));
        setIsRefreshing(false);
        onRefresh?.();
    };

    const renderMiniChart = (metric: MetricTile) => {
        if (!metric.trend) return null;

        const max = Math.max(...metric.trend);
        const min = Math.min(...metric.trend);
        const range = max - min || 1;

        if (metric.chartType === 'bar') {
            return (
                <div className="flex items-end gap-0.5 h-8">
                    {metric.trend.map((val, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${((val - min) / range) * 100}%` }}
                            transition={{ delay: i * 0.05 }}
                            className="flex-1 rounded-t bg-[var(--color-synapse-teal)]"
                            style={{ minHeight: 4 }}
                        />
                    ))}
                </div>
            );
        }

        // Line chart
        const width = 80;
        const height = 32;
        const points = metric.trend.map((val, i) => ({
            x: (i / (metric.trend!.length - 1)) * width,
            y: height - ((val - min) / range) * height,
        }));
        const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

        return (
            <svg width={width} height={height}>
                <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8 }}
                    d={pathD}
                    fill="none"
                    stroke="var(--color-synapse-teal)"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>
        );
    };

    return (
        <div className={`glass-card ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                            <LineChart className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Executive Dashboard</h3>
                            <p className="text-xs text-[var(--color-steel)]">{dateRange}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="btn-secondary text-xs">
                            <Calendar className="w-4 h-4" />
                            <span>{dateRange}</span>
                            <ChevronDown className="w-3 h-3" />
                        </button>
                        <button
                            onClick={onExport}
                            className="btn-secondary text-xs"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 text-[var(--color-steel)] ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="p-4">
                <div className="grid grid-cols-3 gap-4">
                    {metrics.map((metric, i) => (
                        <motion.div
                            key={metric.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => setExpandedMetric(expandedMetric === metric.id ? null : metric.id)}
                            className={`p-4 rounded-xl bg-[var(--glass-bg)] border ${expandedMetric === metric.id
                                    ? 'border-[var(--color-synapse-teal)]'
                                    : 'border-[var(--glass-border)]'
                                } cursor-pointer hover:border-[var(--glass-border-hover)] transition-all`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <p className="text-sm text-[var(--color-steel)]">{metric.title}</p>
                                <button className="p-1 rounded hover:bg-[var(--glass-bg-light)]">
                                    <Maximize2 className="w-3 h-3 text-[var(--color-steel)]" />
                                </button>
                            </div>

                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                                    {metric.change && (
                                        <span className={`text-sm ${metric.change.direction === 'up'
                                                ? 'text-[var(--color-success)]'
                                                : 'text-[var(--color-critical)]'
                                            }`}>
                                            {metric.change.direction === 'up' ? '↑' : '↓'} {metric.change.value}%
                                        </span>
                                    )}
                                </div>
                                {renderMiniChart(metric)}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ExecutiveDashboard;
