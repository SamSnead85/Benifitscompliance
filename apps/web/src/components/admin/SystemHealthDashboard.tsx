'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    Server,
    Database,
    Cloud,
    Cpu,
    HardDrive,
    Wifi,
    Clock,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    RefreshCw,
    Zap,
    Globe,
    Lock,
    BarChart3
} from 'lucide-react';

interface SystemHealthDashboardProps {
    className?: string;
}

interface ServiceStatus {
    id: string;
    name: string;
    status: 'operational' | 'degraded' | 'outage';
    uptime: number;
    responseTime: number;
    lastCheck: string;
}

interface SystemMetric {
    label: string;
    value: number;
    max: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
}

const mockServices: ServiceStatus[] = [
    { id: 's1', name: 'API Gateway', status: 'operational', uptime: 99.98, responseTime: 45, lastCheck: '30s ago' },
    { id: 's2', name: 'Database Cluster', status: 'operational', uptime: 99.99, responseTime: 12, lastCheck: '30s ago' },
    { id: 's3', name: 'Authentication Service', status: 'operational', uptime: 99.95, responseTime: 78, lastCheck: '30s ago' },
    { id: 's4', name: 'File Storage', status: 'degraded', uptime: 98.45, responseTime: 234, lastCheck: '30s ago' },
    { id: 's5', name: 'Background Jobs', status: 'operational', uptime: 99.87, responseTime: 156, lastCheck: '30s ago' },
    { id: 's6', name: 'IRS Transmission', status: 'operational', uptime: 99.92, responseTime: 890, lastCheck: '30s ago' },
];

const mockMetrics: SystemMetric[] = [
    { label: 'CPU Usage', value: 42, max: 100, unit: '%', trend: 'stable' },
    { label: 'Memory Usage', value: 67, max: 100, unit: '%', trend: 'up' },
    { label: 'Disk Usage', value: 54, max: 100, unit: '%', trend: 'stable' },
    { label: 'Network I/O', value: 23, max: 100, unit: 'MB/s', trend: 'down' },
];

function getStatusStyle(status: string) {
    switch (status) {
        case 'operational': return { bg: 'bg-[var(--color-success)]', text: 'text-[var(--color-success)]', label: 'Operational' };
        case 'degraded': return { bg: 'bg-[var(--color-warning)]', text: 'text-[var(--color-warning)]', label: 'Degraded' };
        case 'outage': return { bg: 'bg-[var(--color-critical)]', text: 'text-[var(--color-critical)]', label: 'Outage' };
        default: return { bg: 'bg-[var(--color-steel)]', text: 'text-[var(--color-steel)]', label: 'Unknown' };
    }
}

function getMetricColor(value: number, max: number) {
    const percentage = (value / max) * 100;
    if (percentage < 60) return 'var(--color-success)';
    if (percentage < 80) return 'var(--color-warning)';
    return 'var(--color-critical)';
}

export function SystemHealthDashboard({ className = '' }: SystemHealthDashboardProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated(new Date());
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            setLastUpdated(new Date());
        }, 1000);
    };

    const overallStatus = mockServices.some(s => s.status === 'outage')
        ? 'outage'
        : mockServices.some(s => s.status === 'degraded')
            ? 'degraded'
            : 'operational';

    const averageUptime = mockServices.reduce((acc, s) => acc + s.uptime, 0) / mockServices.length;
    const averageResponseTime = mockServices.reduce((acc, s) => acc + s.responseTime, 0) / mockServices.length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`space-y-6 ${className}`}
        >
            {/* Overview Header */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-synapse-emerald)] to-[var(--color-success)] flex items-center justify-center">
                            <Activity className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-white">System Health</h1>
                            <p className="text-sm text-[var(--color-steel)]">
                                Last updated: {lastUpdated.toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${overallStatus === 'operational'
                            ? 'bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)]'
                            : overallStatus === 'degraded'
                                ? 'bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)]'
                                : 'bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)]'
                            }`}>
                            <span className={`w-2 h-2 rounded-full animate-pulse ${getStatusStyle(overallStatus).bg}`} />
                            <span className={`text-sm font-medium ${getStatusStyle(overallStatus).text}`}>
                                All Systems {getStatusStyle(overallStatus).label}
                            </span>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.2)]">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
                            <span className="text-xs text-[var(--color-steel)]">Avg Uptime</span>
                        </div>
                        <p className="text-2xl font-bold text-[var(--color-success)]">{averageUptime.toFixed(2)}%</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[rgba(6,182,212,0.05)] border border-[rgba(6,182,212,0.2)]">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                            <span className="text-xs text-[var(--color-steel)]">Avg Response</span>
                        </div>
                        <p className="text-2xl font-bold text-[var(--color-synapse-teal)]">{Math.round(averageResponseTime)}ms</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                        <div className="flex items-center gap-2 mb-2">
                            <Server className="w-5 h-5 text-[var(--color-steel)]" />
                            <span className="text-xs text-[var(--color-steel)]">Services</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{mockServices.length}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                        <div className="flex items-center gap-2 mb-2">
                            <Globe className="w-5 h-5 text-[var(--color-steel)]" />
                            <span className="text-xs text-[var(--color-steel)]">Regions</span>
                        </div>
                        <p className="text-2xl font-bold text-white">3</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Resource Usage */}
                <div className="glass-card p-5">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                        Resource Usage
                    </h3>
                    <div className="space-y-4">
                        {mockMetrics.map((metric, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-[var(--color-silver)]">{metric.label}</span>
                                    <span className="text-sm font-medium text-white">
                                        {metric.value}{metric.unit === '%' ? '' : ' '}{metric.unit}
                                    </span>
                                </div>
                                <div className="h-2 rounded-full bg-[rgba(255,255,255,0.1)] overflow-hidden">
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: getMetricColor(metric.value, metric.max) }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(metric.value / metric.max) * 100}%` }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Service Status */}
                <div className="col-span-2 glass-card">
                    <div className="p-5 border-b border-[var(--glass-border)]">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <Server className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                            Service Status
                        </h3>
                    </div>
                    <div className="divide-y divide-[var(--glass-border)]">
                        {mockServices.map((service, index) => {
                            const statusStyle = getStatusStyle(service.status);

                            return (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-4 flex items-center justify-between hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`w-2 h-2 rounded-full ${statusStyle.bg}`} />
                                        <span className="font-medium text-white">{service.name}</span>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="text-center">
                                            <p className="text-[var(--color-success)] font-medium">{service.uptime}%</p>
                                            <p className="text-xs text-[var(--color-steel)]">Uptime</p>
                                        </div>
                                        <div className="text-center">
                                            <p className={`font-medium ${service.responseTime > 200 ? 'text-[var(--color-warning)]' : 'text-white'}`}>
                                                {service.responseTime}ms
                                            </p>
                                            <p className="text-xs text-[var(--color-steel)]">Response</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-bold rounded ${statusStyle.bg} text-black`}>
                                            {statusStyle.label}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Recent Incidents */}
            <div className="glass-card p-5">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-[var(--color-warning)]" />
                    Recent Incidents
                </h3>
                <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.2)] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <AlertTriangle className="w-5 h-5 text-[var(--color-warning)]" />
                            <div>
                                <p className="font-medium text-white">File Storage Degraded Performance</p>
                                <p className="text-sm text-[var(--color-steel)]">Investigating increased latency in file storage operations</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-[var(--color-warning)]">Active</p>
                            <p className="text-xs text-[var(--color-steel)]">Started 2h ago</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-lg bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.2)] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
                            <div>
                                <p className="font-medium text-white">Database Maintenance Completed</p>
                                <p className="text-sm text-[var(--color-steel)]">Scheduled maintenance window completed successfully</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-[var(--color-success)]">Resolved</p>
                            <p className="text-xs text-[var(--color-steel)]">Jan 28, 2026</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default SystemHealthDashboard;
