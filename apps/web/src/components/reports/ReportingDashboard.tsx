'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    FileText,
    Shield,
    DollarSign,
    Calendar,
    Download,
    Filter,
    ChevronDown
} from 'lucide-react';

interface ReportingDashboardProps {
    className?: string;
}

interface MetricCard {
    label: string;
    value: string;
    change: number;
    changeLabel: string;
    icon: React.ElementType;
    color: string;
}

const metrics: MetricCard[] = [
    { label: 'Total Employees', value: '4,521', change: 3.2, changeLabel: 'vs last month', icon: Users, color: 'var(--color-synapse-teal)' },
    { label: 'Full-Time Equivalents', value: '412', change: 1.8, changeLabel: 'vs last month', icon: Users, color: 'var(--color-synapse-cyan)' },
    { label: 'Forms Generated', value: '4,498', change: 0, changeLabel: 'for 2025', icon: FileText, color: 'var(--color-synapse-gold)' },
    { label: 'Compliance Score', value: '98.2%', change: 2.1, changeLabel: 'improvement', icon: Shield, color: 'var(--color-success)' },
    { label: 'Penalty Exposure', value: '$0', change: -100, changeLabel: 'risk eliminated', icon: DollarSign, color: 'var(--color-success)' },
    { label: 'Days to Deadline', value: '62', change: 0, changeLabel: 'March 31, 2026', icon: Calendar, color: 'var(--color-warning)' },
];

const monthlyData = [
    { month: 'Jan', fte: 398, employees: 4389, compliance: 96 },
    { month: 'Feb', fte: 402, employees: 4412, compliance: 97 },
    { month: 'Mar', fte: 405, employees: 4445, compliance: 97 },
    { month: 'Apr', fte: 408, employees: 4467, compliance: 98 },
    { month: 'May', fte: 410, employees: 4489, compliance: 98 },
    { month: 'Jun', fte: 412, employees: 4521, compliance: 98 },
];

export function ReportingDashboard({ className = '' }: ReportingDashboardProps) {
    const [timeRange, setTimeRange] = useState<'6m' | '12m' | 'ytd'>('6m');

    const maxFTE = Math.max(...monthlyData.map(d => d.fte));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`space-y-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">Reporting Dashboard</h2>
                        <p className="text-sm text-[var(--color-steel)]">Compliance metrics and analytics</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        {(['6m', '12m', 'ytd'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${timeRange === range
                                        ? 'bg-[var(--color-synapse-teal)] text-black'
                                        : 'text-[var(--color-steel)] hover:text-white'
                                    }`}
                            >
                                {range.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <button className="btn-secondary">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-4">
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
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${metric.color}20` }}
                                >
                                    <Icon className="w-5 h-5" style={{ color: metric.color }} />
                                </div>
                                {metric.change !== 0 && (
                                    <span className={`text-xs flex items-center gap-1 ${metric.change > 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-critical)]'
                                        }`}>
                                        {metric.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {Math.abs(metric.change)}%
                                    </span>
                                )}
                            </div>
                            <p className="text-2xl font-bold text-white font-mono mb-1">{metric.value}</p>
                            <p className="text-sm text-[var(--color-steel)]">{metric.label}</p>
                            <p className="text-xs text-[var(--color-steel)] mt-1">{metric.changeLabel}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-2 gap-6">
                {/* FTE Trend Chart */}
                <div className="glass-card p-5">
                    <h3 className="font-semibold text-white mb-4">FTE Trend</h3>
                    <div className="flex items-end gap-2 h-48">
                        {monthlyData.map((data, i) => (
                            <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(data.fte / maxFTE) * 100}%` }}
                                    transition={{ delay: i * 0.1 }}
                                    className="w-full rounded-t-lg bg-gradient-to-t from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)]"
                                />
                                <span className="text-xs text-[var(--color-steel)]">{data.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Compliance Score Chart */}
                <div className="glass-card p-5">
                    <h3 className="font-semibold text-white mb-4">Compliance Score Trend</h3>
                    <div className="flex items-end gap-2 h-48">
                        {monthlyData.map((data, i) => (
                            <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${data.compliance}%` }}
                                    transition={{ delay: i * 0.1 }}
                                    className="w-full rounded-t-lg bg-gradient-to-t from-[var(--color-success)] to-[#22d3ee]"
                                />
                                <span className="text-xs text-[var(--color-steel)]">{data.month}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Summary Table */}
            <div className="glass-card overflow-hidden">
                <div className="p-4 border-b border-[var(--glass-border)]">
                    <h3 className="font-semibold text-white">Monthly Summary</h3>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="bg-[var(--glass-bg-light)] border-b border-[var(--glass-border)]">
                            <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-steel)]">Month</th>
                            <th className="text-right px-4 py-3 text-xs font-medium text-[var(--color-steel)]">Total Employees</th>
                            <th className="text-right px-4 py-3 text-xs font-medium text-[var(--color-steel)]">FTE Count</th>
                            <th className="text-right px-4 py-3 text-xs font-medium text-[var(--color-steel)]">Compliance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--glass-border)]">
                        {monthlyData.map((row) => (
                            <tr key={row.month} className="hover:bg-[var(--glass-bg-light)]">
                                <td className="px-4 py-3 text-sm text-white">{row.month} 2025</td>
                                <td className="px-4 py-3 text-sm text-white text-right font-mono">{row.employees.toLocaleString()}</td>
                                <td className="px-4 py-3 text-sm text-white text-right font-mono">{row.fte}</td>
                                <td className="px-4 py-3 text-right">
                                    <span className="px-2 py-1 rounded text-xs bg-[rgba(34,197,94,0.2)] text-[var(--color-success)]">
                                        {row.compliance}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}

export default ReportingDashboard;
