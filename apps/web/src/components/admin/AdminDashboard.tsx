'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Building2,
    Activity,
    FileText,
    Database,
    TrendingUp,
    AlertTriangle,
    Clock,
    CheckCircle2,
    ArrowUpRight,
    Server,
    HardDrive
} from 'lucide-react';

interface AdminDashboardProps {
    className?: string;
}

interface SystemMetric {
    name: string;
    value: string;
    change?: number;
    status: 'good' | 'warning' | 'critical';
}

export function AdminDashboard({ className = '' }: AdminDashboardProps) {
    const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

    const kpis = [
        { label: 'Active Organizations', value: '847', change: 12, icon: Building2, color: 'var(--color-synapse-teal)' },
        { label: 'Total Users', value: '12,458', change: 8.5, icon: Users, color: 'var(--color-synapse-cyan)' },
        { label: 'Forms Generated', value: '89,230', change: 23, icon: FileText, color: 'var(--color-synapse-gold)' },
        { label: 'API Requests Today', value: '2.4M', change: -3, icon: Activity, color: 'var(--color-silver)' },
    ];

    const systemMetrics: SystemMetric[] = [
        { name: 'API Response Time', value: '45ms', status: 'good' },
        { name: 'Database Load', value: '34%', status: 'good' },
        { name: 'Memory Usage', value: '68%', status: 'warning' },
        { name: 'Storage Used', value: '2.1TB / 5TB', status: 'good' },
        { name: 'Active Connections', value: '1,247', status: 'good' },
        { name: 'Queue Depth', value: '12', status: 'good' },
    ];

    const recentActivity = [
        { action: 'New organization registered', org: 'Acme Healthcare', time: '2 min ago', type: 'create' },
        { action: 'Bulk 1095-C generation', org: 'Metro Industries', time: '15 min ago', type: 'generate' },
        { action: 'User permission escalated', org: 'Sunrise Benefits', time: '32 min ago', type: 'update' },
        { action: 'API key regenerated', org: 'Pacific Health Systems', time: '1 hour ago', type: 'security' },
        { action: 'Data import completed', org: 'Mountain View HR', time: '2 hours ago', type: 'import' },
    ];

    const alerts = [
        { message: 'High memory usage on worker-03', level: 'warning', time: '5 min ago' },
        { message: 'Scheduled maintenance in 4 hours', level: 'info', time: '1 hour ago' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`space-y-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-[var(--color-steel)]">System overview and management</p>
                </div>
                <div className="flex items-center gap-2">
                    {(['24h', '7d', '30d'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${timeRange === range
                                    ? 'bg-[var(--color-synapse-teal)] text-black'
                                    : 'text-[var(--color-steel)] hover:text-white'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4">
                {kpis.map((kpi, i) => {
                    const Icon = kpi.icon;
                    return (
                        <motion.div
                            key={kpi.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-5"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${kpi.color}20` }}>
                                    <Icon className="w-5 h-5" style={{ color: kpi.color }} />
                                </div>
                                {kpi.change !== undefined && (
                                    <span className={`text-xs flex items-center gap-1 ${kpi.change >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-critical)]'
                                        }`}>
                                        <TrendingUp className={`w-3 h-3 ${kpi.change < 0 ? 'rotate-180' : ''}`} />
                                        {Math.abs(kpi.change)}%
                                    </span>
                                )}
                            </div>
                            <p className="text-2xl font-bold text-white font-mono">{kpi.value}</p>
                            <p className="text-sm text-[var(--color-steel)]">{kpi.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* System Health */}
                <div className="glass-card p-5 col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-white flex items-center gap-2">
                            <Server className="w-5 h-5 text-[var(--color-synapse-cyan)]" />
                            System Health
                        </h2>
                        <span className="px-2 py-1 rounded text-xs bg-[rgba(34,197,94,0.2)] text-[var(--color-success)]">
                            All Systems Operational
                        </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {systemMetrics.map((metric) => (
                            <div key={metric.name} className="p-3 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-xs text-[var(--color-steel)]">{metric.name}</p>
                                    <div className={`w-2 h-2 rounded-full ${metric.status === 'good'
                                            ? 'bg-[var(--color-success)]'
                                            : metric.status === 'warning'
                                                ? 'bg-[var(--color-warning)]'
                                                : 'bg-[var(--color-critical)]'
                                        }`} />
                                </div>
                                <p className="text-lg font-bold text-white font-mono">{metric.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Active Alerts */}
                <div className="glass-card p-5">
                    <h2 className="font-semibold text-white flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-[var(--color-warning)]" />
                        Active Alerts
                    </h2>
                    <div className="space-y-3">
                        {alerts.length > 0 ? alerts.map((alert, i) => (
                            <div key={i} className={`p-3 rounded-lg border ${alert.level === 'warning'
                                    ? 'bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.3)]'
                                    : 'bg-[rgba(6,182,212,0.1)] border-[rgba(6,182,212,0.3)]'
                                }`}>
                                <p className="text-sm text-white">{alert.message}</p>
                                <p className="text-xs text-[var(--color-steel)] mt-1">{alert.time}</p>
                            </div>
                        )) : (
                            <div className="text-center py-4">
                                <CheckCircle2 className="w-8 h-8 mx-auto text-[var(--color-success)] opacity-50 mb-2" />
                                <p className="text-sm text-[var(--color-steel)]">No active alerts</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[var(--color-synapse-gold)]" />
                        Recent Activity
                    </h2>
                    <button className="text-sm text-[var(--color-synapse-teal)] hover:underline flex items-center gap-1">
                        View All <ArrowUpRight className="w-3 h-3" />
                    </button>
                </div>
                <div className="space-y-3">
                    {recentActivity.map((activity, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-4 p-3 rounded-lg bg-[var(--glass-bg-light)] hover:bg-[var(--glass-bg)] transition-colors"
                        >
                            <div className={`w-2 h-2 rounded-full ${activity.type === 'create' ? 'bg-[var(--color-success)]' :
                                    activity.type === 'security' ? 'bg-[var(--color-warning)]' :
                                        'bg-[var(--color-synapse-cyan)]'
                                }`} />
                            <div className="flex-1">
                                <p className="text-sm text-white">{activity.action}</p>
                                <p className="text-xs text-[var(--color-steel)]">{activity.org}</p>
                            </div>
                            <span className="text-xs text-[var(--color-steel)]">{activity.time}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default AdminDashboard;
