'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    CheckCircle2,
    XCircle,
    Clock,
    TrendingUp,
    ArrowUp,
    ArrowDown,
    RefreshCw,
    AlertTriangle,
    Zap,
    Server,
    Database,
    Globe
} from 'lucide-react';

interface SystemMetric {
    name: string;
    value: number | string;
    unit?: string;
    trend?: 'up' | 'down' | 'stable';
    status: 'healthy' | 'warning' | 'critical';
}

interface ServiceStatus {
    name: string;
    status: 'operational' | 'degraded' | 'down';
    uptime: number;
    responseTime: number;
    lastCheck: string;
}

interface SystemHealthMonitorProps {
    className?: string;
}

const defaultMetrics: SystemMetric[] = [
    { name: 'API Response Time', value: 45, unit: 'ms', trend: 'down', status: 'healthy' },
    { name: 'Request Success Rate', value: 99.9, unit: '%', trend: 'stable', status: 'healthy' },
    { name: 'Active Connections', value: 847, trend: 'up', status: 'healthy' },
    { name: 'Queue Depth', value: 12, trend: 'stable', status: 'healthy' },
    { name: 'Memory Usage', value: 68, unit: '%', trend: 'up', status: 'warning' },
    { name: 'CPU Usage', value: 42, unit: '%', trend: 'stable', status: 'healthy' },
];

const defaultServices: ServiceStatus[] = [
    { name: 'API Gateway', status: 'operational', uptime: 99.99, responseTime: 23, lastCheck: '30s ago' },
    { name: 'Authentication Service', status: 'operational', uptime: 99.98, responseTime: 45, lastCheck: '30s ago' },
    { name: 'Employee Data Service', status: 'operational', uptime: 99.95, responseTime: 67, lastCheck: '30s ago' },
    { name: 'Compliance Engine', status: 'operational', uptime: 100, responseTime: 89, lastCheck: '30s ago' },
    { name: 'Report Generator', status: 'degraded', uptime: 98.5, responseTime: 234, lastCheck: '30s ago' },
    { name: 'PDF Service', status: 'operational', uptime: 99.9, responseTime: 156, lastCheck: '30s ago' },
    { name: 'Notification Service', status: 'operational', uptime: 99.85, responseTime: 34, lastCheck: '30s ago' },
    { name: 'HRIS Sync Service', status: 'operational', uptime: 99.7, responseTime: 112, lastCheck: '30s ago' },
];

const statusConfig = {
    operational: { color: 'var(--color-success)', label: 'Operational', icon: CheckCircle2 },
    degraded: { color: 'var(--color-warning)', label: 'Degraded', icon: AlertTriangle },
    down: { color: 'var(--color-critical)', label: 'Down', icon: XCircle }
};

const healthConfig = {
    healthy: 'var(--color-success)',
    warning: 'var(--color-warning)',
    critical: 'var(--color-critical)'
};

export function SystemHealthMonitor({ className = '' }: SystemHealthMonitorProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await new Promise(r => setTimeout(r, 1500));
        setIsRefreshing(false);
    };

    const operationalServices = defaultServices.filter(s => s.status === 'operational').length;
    const overallHealth = (operationalServices / defaultServices.length) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`space-y-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-success)] to-[var(--color-synapse-teal)] flex items-center justify-center">
                        <Activity className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">System Health</h2>
                        <p className="text-xs text-[var(--color-steel)]">
                            All systems operational • Last updated 30s ago
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-[var(--glass-bg)] rounded-lg p-1">
                        {(['1h', '24h', '7d', '30d'] as const).map((range) => (
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
                    <button onClick={handleRefresh} className="btn-secondary">
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Overall Health */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-6"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 relative">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="var(--glass-border)"
                                    strokeWidth="10"
                                />
                                <motion.circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="var(--color-success)"
                                    strokeWidth="10"
                                    strokeDasharray={2 * Math.PI * 45}
                                    initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                                    animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - overallHealth / 100) }}
                                    transition={{ duration: 1 }}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-bold text-white font-mono">{overallHealth.toFixed(0)}%</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Platform Health</h3>
                            <p className="text-sm text-[var(--color-steel)]">
                                {operationalServices} of {defaultServices.length} services operational
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
                                <span className="text-xs text-[var(--color-success)]">All critical systems healthy</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <p className="text-xs text-[var(--color-steel)] mb-1">Uptime (30d)</p>
                            <p className="text-xl font-bold text-white font-mono">99.95%</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-[var(--color-steel)] mb-1">Incidents (30d)</p>
                            <p className="text-xl font-bold text-white font-mono">2</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-[var(--color-steel)] mb-1">Avg Response</p>
                            <p className="text-xl font-bold text-white font-mono">67ms</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-6 gap-4">
                {defaultMetrics.map((metric, i) => (
                    <motion.div
                        key={metric.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-card p-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-[var(--color-steel)]">{metric.name}</span>
                            {metric.trend && (
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center ${metric.trend === 'up' ? 'bg-[rgba(34,197,94,0.2)]' :
                                        metric.trend === 'down' ? 'bg-[rgba(239,68,68,0.2)]' :
                                            'bg-[var(--glass-bg)]'
                                    }`}>
                                    {metric.trend === 'up' && <ArrowUp className="w-3 h-3 text-[var(--color-success)]" />}
                                    {metric.trend === 'down' && <ArrowDown className="w-3 h-3 text-[var(--color-critical)]" />}
                                </span>
                            )}
                        </div>
                        <p className="text-xl font-bold font-mono" style={{ color: healthConfig[metric.status] }}>
                            {metric.value}{metric.unit || ''}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Services Status */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
            >
                <h3 className="font-semibold text-white mb-4">Service Status</h3>
                <div className="grid grid-cols-2 gap-3">
                    {defaultServices.map((service, i) => {
                        const status = statusConfig[service.status];
                        const StatusIcon = status.icon;

                        return (
                            <motion.div
                                key={service.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="flex items-center justify-between p-3 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: `${status.color}20` }}
                                    >
                                        <StatusIcon className="w-4 h-4" style={{ color: status.color }} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{service.name}</p>
                                        <p className="text-xs text-[var(--color-steel)]">
                                            {service.uptime}% uptime • {service.responseTime}ms
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className="px-2 py-0.5 rounded text-xs"
                                    style={{ backgroundColor: `${status.color}20`, color: status.color }}
                                >
                                    {status.label}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default SystemHealthMonitor;
