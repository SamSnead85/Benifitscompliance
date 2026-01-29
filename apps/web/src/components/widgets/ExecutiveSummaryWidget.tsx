'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Clock,
    Users,
    CheckCircle2,
    AlertTriangle,
    FileText,
    TrendingUp,
    Calendar,
    Shield,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    Zap
} from 'lucide-react';

interface ExecutiveSummaryWidgetProps {
    className?: string;
}

interface KPI {
    id: string;
    label: string;
    value: string;
    change: number;
    trend: 'up' | 'down';
    positive: boolean;
    icon: typeof Users;
    color: string;
}

interface DeadlineItem {
    id: string;
    title: string;
    date: string;
    daysRemaining: number;
    priority: 'high' | 'medium' | 'low';
}

const kpis: KPI[] = [
    { id: 'k1', label: 'Compliance Rate', value: '98.5%', change: 0.5, trend: 'up', positive: true, icon: Shield, color: 'text-[var(--color-success)]' },
    { id: 'k2', label: 'FT Eligible', value: '3,891', change: 2.1, trend: 'up', positive: true, icon: Users, color: 'text-blue-400' },
    { id: 'k3', label: 'Pending Reviews', value: '12', change: -15, trend: 'down', positive: true, icon: Clock, color: 'text-[var(--color-warning)]' },
    { id: 'k4', label: 'Penalty Exposure', value: '$0', change: -100, trend: 'down', positive: true, icon: AlertTriangle, color: 'text-[var(--color-synapse-teal)]' },
];

const upcomingDeadlines: DeadlineItem[] = [
    { id: 'd1', title: '1095-C Distribution', date: 'Feb 28, 2026', daysRemaining: 31, priority: 'high' },
    { id: 'd2', title: 'IRS Electronic Filing', date: 'Mar 31, 2026', daysRemaining: 62, priority: 'high' },
    { id: 'd3', title: 'Q1 Compliance Review', date: 'Apr 15, 2026', daysRemaining: 77, priority: 'medium' },
];

const recentActivity = [
    { id: 'a1', action: 'Forms Generated', detail: '4,256 1095-C forms created', time: '2 hours ago', icon: FileText },
    { id: 'a2', action: 'HRIS Sync', detail: '156 records updated from Workday', time: '3 hours ago', icon: Zap },
    { id: 'a3', action: 'User Added', detail: 'Sarah Johnson added as HR Admin', time: 'Yesterday', icon: Users },
];

export function ExecutiveSummaryWidget({ className = '' }: ExecutiveSummaryWidgetProps) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`space-y-6 ${className}`}>
            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4">
                {kpis.map((kpi, index) => {
                    const Icon = kpi.icon;
                    return (
                        <motion.div
                            key={kpi.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card p-5"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <Icon className={`w-6 h-6 ${kpi.color}`} />
                                <div className={`flex items-center gap-1 text-xs font-medium ${kpi.positive ? 'text-[var(--color-success)]' : 'text-[var(--color-critical)]'}`}>
                                    {kpi.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                    {Math.abs(kpi.change)}%
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-white mb-1">{kpi.value}</p>
                            <p className="text-xs text-[var(--color-steel)]">{kpi.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Upcoming Deadlines */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card col-span-2"
                >
                    <div className="p-4 border-b border-[var(--glass-border)] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                            <h3 className="font-medium text-white">Upcoming Deadlines</h3>
                        </div>
                        <button className="text-xs text-[var(--color-synapse-teal)] hover:underline">View Calendar</button>
                    </div>
                    <div className="divide-y divide-[var(--glass-border)]">
                        {upcomingDeadlines.map((deadline) => (
                            <div key={deadline.id} className="p-4 flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${deadline.priority === 'high'
                                        ? 'bg-[rgba(239,68,68,0.1)]'
                                        : deadline.priority === 'medium'
                                            ? 'bg-[rgba(245,158,11,0.1)]'
                                            : 'bg-[rgba(255,255,255,0.05)]'
                                    }`}>
                                    <span className={`text-lg font-bold ${deadline.priority === 'high'
                                            ? 'text-[var(--color-critical)]'
                                            : deadline.priority === 'medium'
                                                ? 'text-[var(--color-warning)]'
                                                : 'text-[var(--color-steel)]'
                                        }`}>{deadline.daysRemaining}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-white">{deadline.title}</h4>
                                    <p className="text-xs text-[var(--color-steel)]">{deadline.date}</p>
                                </div>
                                <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${deadline.priority === 'high'
                                        ? 'bg-[rgba(239,68,68,0.1)] text-[var(--color-critical)]'
                                        : deadline.priority === 'medium'
                                            ? 'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]'
                                            : 'bg-[rgba(255,255,255,0.05)] text-[var(--color-steel)]'
                                    }`}>
                                    {deadline.daysRemaining} days
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="glass-card"
                >
                    <div className="p-4 border-b border-[var(--glass-border)] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                            <h3 className="font-medium text-white">Recent Activity</h3>
                        </div>
                    </div>
                    <div className="divide-y divide-[var(--glass-border)]">
                        {recentActivity.map((activity) => {
                            const Icon = activity.icon;
                            return (
                                <div key={activity.id} className="p-4 flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[var(--color-synapse-teal-muted)] flex items-center justify-center">
                                        <Icon className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white">{activity.action}</p>
                                        <p className="text-xs text-[var(--color-steel)]">{activity.detail}</p>
                                        <p className="text-[10px] text-[var(--color-steel)] mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Compliance Score Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Overall Compliance Health</h3>
                        <p className="text-sm text-[var(--color-steel)]">All systems operational • Last updated 5 min ago</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
                                <span className="text-2xl font-bold text-white">98.5%</span>
                            </div>
                            <p className="text-xs text-[var(--color-steel)]">Compliance Score</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-400" />
                                <span className="text-2xl font-bold text-white">4,256</span>
                            </div>
                            <p className="text-xs text-[var(--color-steel)]">Total Employees</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                                <span className="text-2xl font-bold text-[var(--color-success)]">$0</span>
                            </div>
                            <p className="text-xs text-[var(--color-steel)]">Penalty Exposure</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default ExecutiveSummaryWidget;
