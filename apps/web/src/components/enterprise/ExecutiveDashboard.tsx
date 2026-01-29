'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    Users,
    FileText,
    Shield,
    Clock,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle2,
    Server,
    Cpu,
    Database
} from 'lucide-react';

interface SystemMetric {
    name: string;
    value: string | number;
    unit?: string;
    status: 'healthy' | 'warning' | 'critical';
    trend?: 'up' | 'down' | 'stable';
    change?: string;
}

interface ActiveSession {
    userId: string;
    userName: string;
    clientName: string;
    activity: string;
    duration: string;
    ip: string;
}

interface ExecutiveDashboardProps {
    metrics?: SystemMetric[];
    sessions?: ActiveSession[];
    className?: string;
}

const defaultMetrics: SystemMetric[] = [
    { name: 'Active Users', value: 47, status: 'healthy', trend: 'up', change: '+12%' },
    { name: 'Forms Generated Today', value: 234, status: 'healthy', trend: 'up', change: '+28%' },
    { name: 'Compliance Score Avg', value: '96.8%', status: 'healthy', trend: 'stable' },
    { name: 'Pending Approvals', value: 12, status: 'warning', trend: 'up', change: '+5' },
    { name: 'API Latency', value: 45, unit: 'ms', status: 'healthy', trend: 'down', change: '-15ms' },
    { name: 'Queue Depth', value: 8, status: 'healthy', trend: 'stable' },
];

const defaultSessions: ActiveSession[] = [
    { userId: 'usr-001', userName: 'Sarah M.', clientName: 'Acme Corp', activity: 'Reviewing 1095-C forms', duration: '15m', ip: '192.168.1.xxx' },
    { userId: 'usr-002', userName: 'Mike R.', clientName: 'TechStart', activity: 'Employee import', duration: '23m', ip: '10.0.0.xxx' },
    { userId: 'usr-003', userName: 'Admin', clientName: 'System', activity: 'Running compliance audit', duration: '8m', ip: '172.16.0.xxx' },
];

const statusConfig = {
    healthy: { color: 'var(--color-success)', label: 'Healthy' },
    warning: { color: 'var(--color-warning)', label: 'Warning' },
    critical: { color: 'var(--color-critical)', label: 'Critical' }
};

export function ExecutiveDashboard({
    metrics = defaultMetrics,
    sessions = defaultSessions,
    className = ''
}: ExecutiveDashboardProps) {
    const healthyCount = metrics.filter(m => m.status === 'healthy').length;
    const overallHealth = (healthyCount / metrics.length) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`space-y-6 ${className}`}
        >
            {/* Health Overview */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                        <h3 className="font-semibold text-white">System Health</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full animate-pulse"
                            style={{ backgroundColor: overallHealth >= 80 ? 'var(--color-success)' : 'var(--color-warning)' }}
                        />
                        <span className="text-sm text-[var(--color-silver)]">
                            {overallHealth.toFixed(0)}% operational
                        </span>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-4">
                    {metrics.map((metric, i) => {
                        const status = statusConfig[metric.status];

                        return (
                            <motion.div
                                key={metric.name}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-[var(--color-steel)]">{metric.name}</span>
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: status.color }}
                                    />
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-white font-mono">{metric.value}</span>
                                    {metric.unit && (
                                        <span className="text-xs text-[var(--color-steel)]">{metric.unit}</span>
                                    )}
                                </div>
                                {metric.change && (
                                    <div className="flex items-center gap-1 mt-1">
                                        {metric.trend === 'up' && <TrendingUp className="w-3 h-3 text-[var(--color-success)]" />}
                                        {metric.trend === 'down' && <TrendingDown className="w-3 h-3 text-[var(--color-critical)]" />}
                                        <span className={`text-xs ${metric.trend === 'up' ? 'text-[var(--color-success)]' :
                                                metric.trend === 'down' ? 'text-[var(--color-critical)]' :
                                                    'text-[var(--color-steel)]'
                                            }`}>
                                            {metric.change}
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* System Status */}
            <div className="grid grid-cols-3 gap-4">
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-[rgba(34,197,94,0.2)] flex items-center justify-center">
                            <Server className="w-5 h-5 text-[var(--color-success)]" />
                        </div>
                        <div>
                            <p className="font-medium text-white">API Server</p>
                            <p className="text-xs text-[var(--color-success)]">Operational</p>
                        </div>
                    </div>
                    <div className="flex justify-between text-xs text-[var(--color-steel)]">
                        <span>Uptime: 99.97%</span>
                        <span>30 day</span>
                    </div>
                </div>

                <div className="glass-card p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-[rgba(34,197,94,0.2)] flex items-center justify-center">
                            <Database className="w-5 h-5 text-[var(--color-success)]" />
                        </div>
                        <div>
                            <p className="font-medium text-white">Database</p>
                            <p className="text-xs text-[var(--color-success)]">Operational</p>
                        </div>
                    </div>
                    <div className="flex justify-between text-xs text-[var(--color-steel)]">
                        <span>Connections: 45/100</span>
                        <span>Healthy</span>
                    </div>
                </div>

                <div className="glass-card p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-[rgba(34,197,94,0.2)] flex items-center justify-center">
                            <Cpu className="w-5 h-5 text-[var(--color-success)]" />
                        </div>
                        <div>
                            <p className="font-medium text-white">Worker Queue</p>
                            <p className="text-xs text-[var(--color-success)]">Processing</p>
                        </div>
                    </div>
                    <div className="flex justify-between text-xs text-[var(--color-steel)]">
                        <span>Jobs: 8 queued</span>
                        <span>Normal</span>
                    </div>
                </div>
            </div>

            {/* Active Sessions */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                        <h3 className="font-semibold text-white">Active Sessions</h3>
                        <span className="px-2 py-0.5 rounded text-xs bg-[var(--glass-bg)] text-[var(--color-steel)]">
                            {sessions.length} online
                        </span>
                    </div>
                </div>

                <div className="space-y-2">
                    {sessions.map((session, i) => (
                        <motion.div
                            key={session.userId}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[var(--glass-bg)] flex items-center justify-center text-sm font-medium text-[var(--color-silver)]">
                                    {session.userName.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-white">{session.userName}</span>
                                        <span className="text-xs text-[var(--color-steel)]">• {session.clientName}</span>
                                    </div>
                                    <p className="text-xs text-[var(--color-steel)]">{session.activity}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-[var(--color-steel)]">
                                <span>{session.duration}</span>
                                <span>{session.ip}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default ExecutiveDashboard;
