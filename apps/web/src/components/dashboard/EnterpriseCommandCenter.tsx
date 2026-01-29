'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    FileText,
    AlertTriangle,
    CheckCircle2,
    TrendingUp,
    TrendingDown,
    Clock,
    Calendar,
    Brain,
    Shield,
    Activity,
    DollarSign,
    Bell,
    ArrowRight,
    Sparkles,
    Zap
} from 'lucide-react';

interface DashboardMetric {
    label: string;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down' | 'stable';
    icon: typeof Users;
    color: string;
}

interface ComplianceAlert {
    id: string;
    type: 'critical' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: string;
    actionLabel?: string;
}

interface EnterpriseCommandCenterProps {
    className?: string;
}

const defaultMetrics: DashboardMetric[] = [
    { label: 'Total Employees', value: '4,521', change: 2.3, trend: 'up', icon: Users, color: 'var(--color-synapse-teal)' },
    { label: 'Compliance Score', value: '96.8%', change: 1.2, trend: 'up', icon: Shield, color: 'var(--color-success)' },
    { label: 'Full-Time Equivalents', value: '4,298', change: 3.1, trend: 'up', icon: Zap, color: 'var(--color-synapse-cyan)' },
    { label: 'Forms Generated', value: '4,498', change: 0, trend: 'stable', icon: FileText, color: 'var(--color-synapse-gold)' },
    { label: 'Pending Actions', value: '23', change: -15.2, trend: 'down', icon: Clock, color: 'var(--color-warning)' },
    { label: 'At-Risk Employees', value: '8', change: -12.5, trend: 'down', icon: AlertTriangle, color: 'var(--color-critical)' },
];

const defaultAlerts: ComplianceAlert[] = [
    { id: 'alert-001', type: 'critical', title: 'IRS Filing Deadline', message: 'Form 1094-C deadline is March 31, 2026. 23 forms have errors.', timestamp: '2h ago', actionLabel: 'Review Forms' },
    { id: 'alert-002', type: 'warning', title: 'Coverage Gap Detected', message: '15 employees may not meet MEC requirements for Q1.', timestamp: '4h ago', actionLabel: 'View Employees' },
    { id: 'alert-003', type: 'info', title: 'HRIS Sync Complete', message: '2,145 employee records synced from Gusto.', timestamp: '6h ago' },
];

const recentActivity = [
    { action: 'Generated', item: '1095-C batch for 4,521 employees', user: 'System', time: '15m ago', icon: FileText },
    { action: 'Updated', item: 'Safe harbor codes for 156 employees', user: 'Sarah M.', time: '1h ago', icon: CheckCircle2 },
    { action: 'Imported', item: 'Employee data from Gusto HRIS', user: 'System', time: '2h ago', icon: Users },
    { action: 'Resolved', item: '12 data quality issues', user: 'Michael C.', time: '3h ago', icon: Zap },
];

const complianceBreakdown = [
    { category: 'Coverage Offers', score: 98.2, employees: 4432 },
    { category: 'Affordability', score: 94.5, employees: 4262 },
    { category: 'Waiting Period', score: 99.1, employees: 4480 },
    { category: 'Minimum Value', score: 97.8, employees: 4418 },
];

export function EnterpriseCommandCenter({ className = '' }: EnterpriseCommandCenterProps) {
    const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`space-y-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        Command Center
                        <span className="px-2 py-1 rounded text-xs bg-gradient-to-r from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] text-black font-medium">
                            Enterprise
                        </span>
                    </h1>
                    <p className="text-sm text-[var(--color-steel)] mt-1">
                        Real-time compliance monitoring for Acme Corporation
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-[var(--glass-bg)] rounded-lg p-1">
                        {(['today', 'week', 'month', 'year'] as const).map((period) => (
                            <button
                                key={period}
                                onClick={() => setSelectedPeriod(period)}
                                className={`px-3 py-1.5 rounded text-sm transition-colors ${selectedPeriod === period
                                        ? 'bg-[var(--color-synapse-teal)] text-black'
                                        : 'text-[var(--color-steel)] hover:text-white'
                                    }`}
                            >
                                {period.charAt(0).toUpperCase() + period.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-6 gap-4">
                {defaultMetrics.map((metric, i) => {
                    const Icon = metric.icon;
                    return (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card p-4"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${metric.color}20` }}
                                >
                                    <Icon className="w-5 h-5" style={{ color: metric.color }} />
                                </div>
                                {metric.change !== undefined && metric.change !== 0 && (
                                    <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${(metric.trend === 'up' && metric.label.includes('Risk')) ||
                                            (metric.trend === 'up' && metric.label.includes('Pending'))
                                            ? 'bg-[rgba(239,68,68,0.2)] text-[var(--color-critical)]'
                                            : metric.trend === 'up'
                                                ? 'bg-[rgba(34,197,94,0.2)] text-[var(--color-success)]'
                                                : metric.trend === 'down'
                                                    ? 'bg-[rgba(34,197,94,0.2)] text-[var(--color-success)]'
                                                    : 'bg-[var(--glass-bg)] text-[var(--color-steel)]'
                                        }`}>
                                        {metric.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {Math.abs(metric.change)}%
                                    </span>
                                )}
                            </div>
                            <p className="text-2xl font-bold text-white font-mono mb-1">{metric.value}</p>
                            <p className="text-xs text-[var(--color-steel)]">{metric.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-3 gap-6">
                {/* Compliance Score Ring */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                >
                    <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-[var(--color-success)]" />
                        Overall Compliance
                    </h3>
                    <div className="flex items-center gap-6">
                        <div className="w-32 h-32 relative">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--glass-border)" strokeWidth="8" />
                                <motion.circle
                                    cx="50" cy="50" r="42" fill="none"
                                    stroke="var(--color-success)"
                                    strokeWidth="8"
                                    strokeDasharray={2 * Math.PI * 42}
                                    initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                                    animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - 0.968) }}
                                    transition={{ duration: 1 }}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold text-white font-mono">96.8%</span>
                                <span className="text-xs text-[var(--color-success)]">+1.2%</span>
                            </div>
                        </div>
                        <div className="flex-1 space-y-3">
                            {complianceBreakdown.map((item, i) => (
                                <motion.div
                                    key={item.category}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                >
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-[var(--color-steel)]">{item.category}</span>
                                        <span className="text-white font-mono">{item.score}%</span>
                                    </div>
                                    <div className="h-1.5 bg-[var(--glass-bg)] rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.score}%` }}
                                            transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                                            className="h-full rounded-full bg-[var(--color-success)]"
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Active Alerts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <Bell className="w-5 h-5 text-[var(--color-warning)]" />
                            Active Alerts
                        </h3>
                        <span className="px-2 py-0.5 rounded text-xs bg-[rgba(239,68,68,0.2)] text-[var(--color-critical)]">
                            {defaultAlerts.filter(a => a.type === 'critical').length} critical
                        </span>
                    </div>
                    <div className="space-y-3">
                        {defaultAlerts.map((alert, i) => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`p-3 rounded-lg border ${alert.type === 'critical'
                                        ? 'bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.3)]'
                                        : alert.type === 'warning'
                                            ? 'bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.3)]'
                                            : 'bg-[var(--glass-bg-light)] border-[var(--glass-border)]'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${alert.type === 'critical' ? 'text-[var(--color-critical)]' :
                                            alert.type === 'warning' ? 'text-[var(--color-warning)]' :
                                                'text-[var(--color-synapse-cyan)]'
                                        }`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white">{alert.title}</p>
                                        <p className="text-xs text-[var(--color-steel)] mt-0.5 line-clamp-1">{alert.message}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs text-[var(--color-steel)]">{alert.timestamp}</span>
                                            {alert.actionLabel && (
                                                <button className="text-xs text-[var(--color-synapse-teal)] hover:underline flex items-center gap-1">
                                                    {alert.actionLabel}
                                                    <ArrowRight className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                >
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[var(--color-synapse-cyan)]" />
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {recentActivity.map((activity, i) => {
                            const Icon = activity.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-3"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-[var(--glass-bg-light)] flex items-center justify-center shrink-0">
                                        <Icon className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white">
                                            <span className="text-[var(--color-synapse-teal)]">{activity.action}</span>
                                            {' '}{activity.item}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-[var(--color-steel)]">{activity.user}</span>
                                            <span className="text-xs text-[var(--color-steel)]">•</span>
                                            <span className="text-xs text-[var(--color-steel)]">{activity.time}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* AI Insights Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 bg-gradient-to-r from-[rgba(20,184,166,0.1)] to-[rgba(6,182,212,0.1)] border-[rgba(20,184,166,0.3)]"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                            <Brain className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                AI Recommendation
                                <Sparkles className="w-4 h-4 text-[var(--color-synapse-gold)]" />
                            </h3>
                            <p className="text-sm text-[var(--color-steel)]">
                                Switch 156 employees from W-2 to Rate of Pay safe harbor to reduce audit risk by 34% while maintaining full compliance.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-xs bg-[var(--glass-bg)] text-[var(--color-steel)]">
                            87% confidence
                        </span>
                        <button className="btn-primary">
                            Apply Optimization
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default EnterpriseCommandCenter;
