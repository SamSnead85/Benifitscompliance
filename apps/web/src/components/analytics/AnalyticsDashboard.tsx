'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    TrendingUp,
    Users,
    DollarSign,
    Shield,
    CheckCircle2,
    Download,
    RefreshCw,
    ArrowUpRight,
    ArrowDownRight,
    Building2,
    Loader2
} from 'lucide-react';

interface AnalyticsDashboardProps {
    className?: string;
}

interface MetricCard {
    id: string;
    title: string;
    value: string;
    change: number;
    trend: 'up' | 'down' | 'stable';
    icon: typeof Users;
    color: string;
    bgColor: string;
}

interface ChartData {
    label: string;
    value: number;
    color: string;
}

const metrics: MetricCard[] = [
    { id: 'm1', title: 'Total Employees', value: '4,256', change: 3.2, trend: 'up', icon: Users, color: 'text-blue-400', bgColor: 'bg-[rgba(59,130,246,0.1)]' },
    { id: 'm2', title: 'FT Eligible', value: '3,891', change: 2.1, trend: 'up', icon: Shield, color: 'text-[var(--color-success)]', bgColor: 'bg-[rgba(16,185,129,0.1)]' },
    { id: 'm3', title: 'Compliance Rate', value: '98.5%', change: 0.5, trend: 'up', icon: CheckCircle2, color: 'text-[var(--color-synapse-teal)]', bgColor: 'bg-[var(--color-synapse-teal-muted)]' },
    { id: 'm4', title: 'Penalty Exposure', value: '$0', change: -100, trend: 'down', icon: DollarSign, color: 'text-[var(--color-warning)]', bgColor: 'bg-[rgba(245,158,11,0.1)]' },
];

const ftStatusDistribution: ChartData[] = [
    { label: 'Full-Time', value: 3891, color: 'bg-[var(--color-success)]' },
    { label: 'Variable Hour', value: 245, color: 'bg-[var(--color-warning)]' },
    { label: 'Part-Time', value: 98, color: 'bg-[var(--color-steel)]' },
    { label: 'Seasonal', value: 22, color: 'bg-blue-400' },
];

const monthlyTrends = [
    { month: 'Aug', employees: 4100 },
    { month: 'Sep', employees: 4150 },
    { month: 'Oct', employees: 4180 },
    { month: 'Nov', employees: 4200 },
    { month: 'Dec', employees: 4230 },
    { month: 'Jan', employees: 4256 },
];

const organizationBreakdown = [
    { name: 'Acme Corporation', employees: 2456, compliance: 99.2, status: 'healthy' },
    { name: 'TechStart Inc', employees: 890, compliance: 98.1, status: 'healthy' },
    { name: 'Global Services LLC', employees: 567, compliance: 97.5, status: 'warning' },
    { name: 'Innovation Labs', employees: 343, compliance: 99.8, status: 'healthy' },
];

export function AnalyticsDashboard({ className = '' }: AnalyticsDashboardProps) {
    const [dateRange, setDateRange] = useState('ytd');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1500);
    };

    const totalFT = ftStatusDistribution.reduce((acc, d) => acc + d.value, 0);
    const maxTrend = Math.max(...monthlyTrends.map(t => t.employees));

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
                    <p className="text-sm text-[var(--color-steel)]">Compliance metrics and workforce insights</p>
                </div>
                <div className="flex items-center gap-3">
                    <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-4 py-2 text-sm bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white">
                        <option value="mtd">Month to Date</option>
                        <option value="ytd">Year to Date</option>
                    </select>
                    <button onClick={handleRefresh} disabled={isRefreshing} className="btn-secondary flex items-center gap-2">
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-4">
                {metrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <motion.div key={metric.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="glass-card p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${metric.bgColor}`}>
                                    <Icon className={`w-5 h-5 ${metric.color}`} />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-medium ${metric.trend === 'up' ? 'text-[var(--color-success)]' : 'text-[var(--color-success)]'}`}>
                                    {metric.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                    {Math.abs(metric.change)}%
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
                            <p className="text-xs text-[var(--color-steel)]">{metric.title}</p>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* FT Status */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5">
                    <h3 className="font-medium text-white mb-4">FT Status Distribution</h3>
                    <div className="space-y-3">
                        {ftStatusDistribution.map((item, index) => (
                            <div key={index}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-[var(--color-silver)]">{item.label}</span>
                                    <span className="text-sm font-medium text-white">{item.value.toLocaleString()}</span>
                                </div>
                                <div className="h-2 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(item.value / totalFT) * 100}%` }} className={`h-full rounded-full ${item.color}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Trend */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5">
                    <h3 className="font-medium text-white mb-4">6-Month Trend</h3>
                    <div className="flex items-end gap-2 h-32">
                        {monthlyTrends.map((data, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center gap-1">
                                <motion.div initial={{ height: 0 }} animate={{ height: `${(data.employees / maxTrend) * 100}%` }} className="w-full bg-gradient-to-t from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] rounded-t" />
                                <span className="text-[10px] text-[var(--color-steel)]">{data.month}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Org Breakdown */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card">
                <div className="p-5 border-b border-[var(--glass-border)]">
                    <h3 className="font-medium text-white">Organization Breakdown</h3>
                </div>
                <div className="divide-y divide-[var(--glass-border)]">
                    {organizationBreakdown.map((org, index) => (
                        <div key={index} className="p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-white">{org.name}</h4>
                                <p className="text-xs text-[var(--color-steel)]">{org.employees.toLocaleString()} employees</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-white">{org.compliance}%</p>
                                <p className="text-xs text-[var(--color-steel)]">Compliance</p>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${org.status === 'healthy' ? 'bg-[var(--color-success)]' : 'bg-[var(--color-warning)]'}`} />
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default AnalyticsDashboard;
