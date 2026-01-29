'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Users,
    Activity,
    Calendar,
    Download,
    RefreshCw,
    ChevronDown
} from 'lucide-react';

interface ClaimsMetric {
    label: string;
    value: string;
    change: number;
    trend: 'up' | 'down';
    detail: string;
}

interface ClaimCategory {
    name: string;
    claims: number;
    amount: number;
    percentOfTotal: number;
    color: string;
}

interface ClaimsAnalyticsDashboardProps {
    className?: string;
}

const defaultMetrics: ClaimsMetric[] = [
    { label: 'Total Claims YTD', value: '$4.2M', change: 8.5, trend: 'up', detail: '2,847 claims processed' },
    { label: 'Avg Claim Amount', value: '$1,475', change: -3.2, trend: 'down', detail: 'Lower than industry avg' },
    { label: 'PMPM Cost', value: '$485', change: 5.1, trend: 'up', detail: 'Per member per month' },
    { label: 'Claims Pending', value: '143', change: -12.5, trend: 'down', detail: 'Down from last month' },
];

const defaultCategories: ClaimCategory[] = [
    { name: 'Medical - Inpatient', claims: 456, amount: 1560000, percentOfTotal: 37.1, color: '#10B981' },
    { name: 'Medical - Outpatient', claims: 1234, amount: 890000, percentOfTotal: 21.2, color: '#06B6D4' },
    { name: 'Prescription Drugs', claims: 2156, amount: 720000, percentOfTotal: 17.1, color: '#8B5CF6' },
    { name: 'Specialty Care', claims: 287, amount: 580000, percentOfTotal: 13.8, color: '#F59E0B' },
    { name: 'Lab & Diagnostics', claims: 892, amount: 310000, percentOfTotal: 7.4, color: '#3B82F6' },
    { name: 'Other Services', claims: 422, amount: 140000, percentOfTotal: 3.3, color: '#6B7280' },
];

const monthlyTrend = [
    { month: 'Jun', amount: 320000 },
    { month: 'Jul', amount: 380000 },
    { month: 'Aug', amount: 345000 },
    { month: 'Sep', amount: 410000 },
    { month: 'Oct', amount: 395000 },
    { month: 'Nov', amount: 425000 },
    { month: 'Dec', amount: 455000 },
    { month: 'Jan', amount: 490000 },
];

export function ClaimsAnalyticsDashboard({ className = '' }: ClaimsAnalyticsDashboardProps) {
    const [timeRange, setTimeRange] = useState<'mtd' | 'qtd' | 'ytd' | 'custom'>('ytd');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const maxTrend = Math.max(...monthlyTrend.map(m => m.amount));

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await new Promise(r => setTimeout(r, 2000));
        setIsRefreshing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`space-y-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-gold)] to-[var(--color-warning)] flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">Claims Analytics</h2>
                        <p className="text-xs text-[var(--color-steel)]">Self-Insured Plan Performance</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-[var(--glass-bg)] rounded-lg p-1">
                        {(['mtd', 'qtd', 'ytd'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1 rounded text-sm transition-colors ${timeRange === range
                                        ? 'bg-[var(--color-synapse-teal)] text-black'
                                        : 'text-[var(--color-steel)] hover:text-white'
                                    }`}
                            >
                                {range.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <button onClick={handleRefresh} className="btn-secondary">
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                    <button className="btn-secondary">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-4">
                {defaultMetrics.map((metric, i) => (
                    <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-card p-5"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-sm text-[var(--color-steel)]">{metric.label}</p>
                            <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${metric.trend === 'down' && metric.label.includes('Pending') || metric.trend === 'down' && metric.label.includes('Avg')
                                    ? 'bg-[rgba(34,197,94,0.2)] text-[var(--color-success)]'
                                    : metric.trend === 'up'
                                        ? 'bg-[rgba(245,158,11,0.2)] text-[var(--color-warning)]'
                                        : 'bg-[rgba(34,197,94,0.2)] text-[var(--color-success)]'
                                }`}>
                                {metric.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {Math.abs(metric.change)}%
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-white font-mono mb-1">{metric.value}</p>
                        <p className="text-xs text-[var(--color-steel)]">{metric.detail}</p>
                    </motion.div>
                ))}
            </div>

            {/* Claims Trend Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
            >
                <h3 className="font-semibold text-white mb-6">Monthly Claims Trend</h3>
                <div className="flex items-end gap-3 h-48">
                    {monthlyTrend.map((month, i) => (
                        <motion.div
                            key={month.month}
                            initial={{ height: 0 }}
                            animate={{ height: `${(month.amount / maxTrend) * 100}%` }}
                            transition={{ delay: i * 0.05, duration: 0.5 }}
                            className="flex-1 relative group"
                        >
                            <div
                                className="absolute inset-0 rounded-t-lg bg-gradient-to-t from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--glass-bg)] px-2 py-1 rounded text-xs text-white whitespace-nowrap">
                                ${(month.amount / 1000).toFixed(0)}K
                            </div>
                            <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-[var(--color-steel)]">
                                {month.month}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Claims by Category */}
            <div className="grid grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                >
                    <h3 className="font-semibold text-white mb-4">Claims by Category</h3>
                    <div className="space-y-4">
                        {defaultCategories.map((category, i) => (
                            <motion.div
                                key={category.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: category.color }}
                                        />
                                        <span className="text-sm text-[var(--color-silver)]">{category.name}</span>
                                    </div>
                                    <span className="text-sm font-mono text-white">
                                        ${(category.amount / 1000).toFixed(0)}K
                                    </span>
                                </div>
                                <div className="h-2 bg-[var(--glass-bg)] rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${category.percentOfTotal}%` }}
                                        transition={{ duration: 0.8, delay: i * 0.1 }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: category.color }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* High-Cost Claimants */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white">High-Cost Claimants</h3>
                        <span className="px-2 py-1 rounded text-xs bg-[rgba(239,68,68,0.2)] text-[var(--color-critical)] flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            8 at risk
                        </span>
                    </div>
                    <div className="space-y-3">
                        {[
                            { id: 'CLM-001', amount: 245000, diagnosis: 'Cardiovascular', risk: 'high' },
                            { id: 'CLM-002', amount: 189000, diagnosis: 'Oncology', risk: 'high' },
                            { id: 'CLM-003', amount: 156000, diagnosis: 'Orthopedic', risk: 'medium' },
                            { id: 'CLM-004', amount: 134000, diagnosis: 'Specialty Rx', risk: 'high' },
                            { id: 'CLM-005', amount: 98000, diagnosis: 'Chronic Care', risk: 'medium' },
                        ].map((claimant, i) => (
                            <motion.div
                                key={claimant.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center justify-between p-3 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${claimant.risk === 'high' ? 'bg-[var(--color-critical)]' : 'bg-[var(--color-warning)]'
                                        }`} />
                                    <div>
                                        <p className="text-sm font-mono text-white">{claimant.id}</p>
                                        <p className="text-xs text-[var(--color-steel)]">{claimant.diagnosis}</p>
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-white font-mono">
                                    ${(claimant.amount / 1000).toFixed(0)}K
                                </p>
                            </motion.div>
                        ))}
                    </div>
                    <p className="mt-4 text-xs text-[var(--color-steel)] flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Review high-cost claimants for stop-loss assessment
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default ClaimsAnalyticsDashboard;
