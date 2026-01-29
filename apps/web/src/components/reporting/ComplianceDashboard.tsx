'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    PieChart,
    LineChart,
    TrendingUp,
    TrendingDown,
    Users,
    Shield,
    FileText,
    Calendar,
    Download,
    Share2,
    Maximize2,
    RefreshCw,
    Filter,
    ChevronDown
} from 'lucide-react';

interface DashboardWidget {
    id: string;
    type: 'metric' | 'chart' | 'list' | 'progress';
    title: string;
    data: unknown;
    size: '1x1' | '2x1' | '1x2' | '2x2';
}

interface ComplianceDashboardProps {
    className?: string;
}

export function ComplianceDashboard({ className = '' }: ComplianceDashboardProps) {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await new Promise(r => setTimeout(r, 1500));
        setIsRefreshing(false);
    };

    const metrics = [
        { label: 'Overall Compliance', value: '96.8%', trend: '+1.2%', status: 'up', icon: Shield },
        { label: 'Employees Tracked', value: '4,521', trend: '+127', status: 'up', icon: Users },
        { label: 'Forms Generated', value: '4,298', trend: '+234', status: 'up', icon: FileText },
        { label: 'Pending Actions', value: '23', trend: '-8', status: 'down', icon: Calendar },
    ];

    const complianceByCategory = [
        { category: 'Coverage Offers', value: 98.2, color: 'var(--color-synapse-teal)' },
        { category: 'Affordability', value: 94.5, color: 'var(--color-synapse-cyan)' },
        { category: 'Waiting Period', value: 99.1, color: 'var(--color-success)' },
        { category: 'Reporting', value: 95.8, color: 'var(--color-synapse-gold)' },
    ];

    const monthlyTrend = [
        { month: 'Aug', value: 92.4 },
        { month: 'Sep', value: 93.8 },
        { month: 'Oct', value: 94.2 },
        { month: 'Nov', value: 95.1 },
        { month: 'Dec', value: 95.9 },
        { month: 'Jan', value: 96.8 },
    ];

    const recentIssues = [
        { id: 1, type: 'warning', message: 'Affordability threshold exceeded for 15 employees', time: '2h ago' },
        { id: 2, type: 'info', message: 'Monthly measurement period completed', time: '5h ago' },
        { id: 3, type: 'success', message: '1095-C batch approved for distribution', time: '1d ago' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`space-y-6 ${className}`}
        >
            {/* Header Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                    <h2 className="text-xl font-semibold text-white">Compliance Dashboard</h2>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-[var(--glass-bg)] rounded-lg p-1">
                        {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1 rounded text-sm transition-colors ${timeRange === range
                                        ? 'bg-[var(--color-synapse-teal)] text-black'
                                        : 'text-[var(--color-steel)] hover:text-white'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="btn-secondary"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                    <button className="btn-secondary">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4">
                {metrics.map((metric, i) => {
                    const Icon = metric.icon;
                    return (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card p-5"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-lg bg-[var(--glass-bg)] flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                                </div>
                                <div className={`flex items-center gap-1 text-sm ${metric.status === 'up' ? 'text-[var(--color-success)]' : 'text-[var(--color-critical)]'
                                    }`}>
                                    {metric.status === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                    {metric.trend}
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-white font-mono mb-1">{metric.value}</p>
                            <p className="text-sm text-[var(--color-steel)]">{metric.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-3 gap-6">
                {/* Compliance by Category */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-5"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white">Compliance by Category</h3>
                        <PieChart className="w-4 h-4 text-[var(--color-steel)]" />
                    </div>
                    <div className="space-y-4">
                        {complianceByCategory.map((cat) => (
                            <div key={cat.category}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-[var(--color-silver)]">{cat.category}</span>
                                    <span className="text-sm font-mono text-white">{cat.value}%</span>
                                </div>
                                <div className="h-2 bg-[var(--glass-bg)] rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${cat.value}%` }}
                                        transition={{ duration: 1, delay: 0.3 }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: cat.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Monthly Trend */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-5 col-span-2"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white">Compliance Trend</h3>
                        <LineChart className="w-4 h-4 text-[var(--color-steel)]" />
                    </div>
                    <div className="h-48 flex items-end justify-between gap-2">
                        {monthlyTrend.map((point, i) => (
                            <div key={point.month} className="flex-1 flex flex-col items-center gap-2">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(point.value - 90) * 10}%` }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="w-full rounded-t-lg bg-gradient-to-t from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)]"
                                    style={{ minHeight: '20px' }}
                                />
                                <span className="text-xs text-[var(--color-steel)]">{point.month}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-center mt-4 gap-2">
                        <div className="w-3 h-3 rounded bg-gradient-to-r from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)]" />
                        <span className="text-xs text-[var(--color-steel)]">Overall Compliance Rate</span>
                    </div>
                </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-5"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Recent Activity</h3>
                    <button className="text-sm text-[var(--color-synapse-teal)] hover:underline">View All</button>
                </div>
                <div className="space-y-3">
                    {recentIssues.map((issue) => (
                        <div
                            key={issue.id}
                            className="flex items-center gap-4 p-3 rounded-lg bg-[var(--glass-bg-light)]"
                        >
                            <div className={`w-2 h-2 rounded-full ${issue.type === 'warning' ? 'bg-[var(--color-warning)]' :
                                    issue.type === 'success' ? 'bg-[var(--color-success)]' :
                                        'bg-[var(--color-synapse-cyan)]'
                                }`} />
                            <span className="flex-1 text-sm text-[var(--color-silver)]">{issue.message}</span>
                            <span className="text-xs text-[var(--color-steel)]">{issue.time}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default ComplianceDashboard;
